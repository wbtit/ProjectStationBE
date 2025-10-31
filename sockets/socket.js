import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import prisma from "../src/lib/prisma.js";
import { Compression, decompression } from "../src/utils/Zstd.js";
import redis from "../redis/redisClient.js";

export const initSocket = async (io) => {
  // --- Redis pub/sub setup for Socket.IO adapter ---
  const pubClient = createClient({ url: "redis://127.0.0.1:6379" });
  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  io.adapter(createAdapter(pubClient, subClient));

  io.on("connection", async (socket) => {
    console.log(`🔌 User connected socketId: ${socket.id}`);

    const userId = socket.handshake.auth?.userId;
    if (!userId) {
      console.log("❌ No userId in handshake — disconnecting socket.");
      return socket.disconnect(true);
    }

    /** ✅ Safely store socket in a Redis SET */
    const key = `userSocket:${userId}`;
    const type = await redis.type(key);
    if (type !== "set" && type !== "none") {
      await redis.del(key); // clear old invalid key type
    }

    await redis.sAdd(key, socket.id);
    console.log(`👤 User ${userId} joined. Socket ID mapped: ${socket.id}`);

    /** -------------------- Pending Notifications -------------------- **/
    const pendingNotifications = await prisma.notification.findMany({
      where: { userID: userId, delivered: false },
    });

    for (const notification of pendingNotifications) {
      socket.emit("customNotification", notification.payload);
      await prisma.notification.update({
        where: { id: notification.id },
        data: { delivered: true },
      });
    }

    /** -------------------- Private Messages -------------------- **/
    socket.on("privateMessages", async ({ content, senderId, receiverId }) => {
      const compressed = await Compression(content);

      const message = await prisma.message.create({
        data: {
          contentCompressed: compressed,
          senderId,
          receiverId,
        },
      });

      const receiverKey = `userSocket:${receiverId}`;
      const receiverSockets = await redis.sMembers(receiverKey);

      if (receiverSockets.length > 0) {
        // receiver online
        const decompressed = await decompression(message.contentCompressed);
        for (const sid of receiverSockets) {
          io.to(sid).emit("receivePrivateMessage", {
            ...message,
            content: decompressed,
          });
        }
      } else {
        // receiver offline
        await prisma.notification.create({
          data: {
            userID: receiverId,
            payload: {
              type: "PrivateMessage",
              contentCompressed: compressed,
              senderId,
              receiverId,
              messageId: message.id,
            },
            delivered: false,
          },
        });
      }
    });

    /** -------------------- Group Messages -------------------- **/
    socket.on(
      "groupMessages",
      async ({ content, groupId, senderId, taggedUserIds = [] }) => {
        const compressed = await Compression(content);

        const message = await prisma.message.create({
          data: {
            contentCompressed: compressed,
            senderId,
            groupId,
            taggedUsers: {
              connect: taggedUserIds.map((id) => ({ id })),
            },
          },
          include: { taggedUsers: true },
        });

        const groupMembers = await prisma.groupUser.findMany({
          where: { groupId },
          select: { memberId: true },
        });

        const decompressed = await decompression(message.contentCompressed);

        for (const member of groupMembers) {
          if (member.memberId === senderId) continue;

          const memberKey = `userSocket:${member.memberId}`;
          const sockets = await redis.sMembers(memberKey);
          const isTagged = taggedUserIds.includes(member.memberId);

          const payload = {
            ...message,
            content: decompressed,
            isTagged,
          };

          if (sockets.length > 0) {
            for (const sid of sockets) {
              io.to(sid).emit("receiveGroupMessage", payload);
            }
          } else {
            await prisma.notification.create({
              data: {
                userID: member.memberId,
                payload: {
                  type: "GroupMessages",
                  groupId,
                  contentCompressed: compressed,
                  isTagged,
                },
                delivered: false,
              },
            });
          }
        }
      }
    );

    /** -------------------- Disconnect -------------------- **/
    socket.on("disconnect", async () => {
      const keys = await redis.keys("userSocket:*");
      for (const key of keys) {
        await redis.sRem(key, socket.id);
      }
      console.log(`🧹 Socket disconnected & cleaned: ${socket.id}`);
    });
  });
};
