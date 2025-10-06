import redis from "../../redis/redisClient.js";
import prisma from "../lib/prisma.js";

export const sendNotification = async(userId, payload) => {
  const socketId = await redis.get(`socket:${userId}`)
  if (socketId && global.io) {
    console.log(`📢 Sending notification to socket ${socketId} for user ${userId}`);
    global.io.to(socketId).emit("customNotification", payload);
    await prisma.notification.create({
      data:{
        userID:userId,
        payload:payload,
        delivered:false
      }
    })
  } else {
    console.warn(`⚠️ No socket found for userId: ${userId}`);

    await prisma.notification.create({
      data:{
        userID:userId,
        payload:payload,
        delivered:false
      }
    })
  }
};