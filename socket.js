import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import redis from "./redisClient.js";
import prisma from "./src/lib/prisma.js";
import { Compression, decompression } from "./src/utils/Zstd.js";


const userSocketMap = new Map();

const initSocket = async(io) => {

  const pubClient=createClient({url:"redis://127.0.0.1:6379"})
  const subClient=pubClient.duplicate()

  await pubClient.connect()
  await subClient.connect()

  io.adapter(createAdapter(pubClient,subClient))


  io.on("connection", async(socket) => {
      console.log(`🔌 User connected socketId: ${socket.id}`);

      const userId= socket.handshake.auth?.userId
      if(!userId){
        console.log("❌ No userId in handshake — disconnecting socket.");
      return socket.disconnect(true);
      }

    await redis.set(`socket:${userId}`,socket.id)
    console.log(`👤 User ${userId} joined. Socket ID mapped: ${socket.id}`);

    const pendingNotifications = await prisma.notification.findMany({
      where: { userID: userId, delivered: false }
    });

    for (const notification of pendingNotifications) {
      socket.emit("customNotification", notification.payload);

      await prisma.notification.update({
        where: { id: notification.id },
        data: { delivered: true }
      });
    }

    socket.on("privateMessages",async({content,senderId,receiverId})=>{

      const message= await prisma.message.create({
        data:{
          contentCompressed:await Compression(content),
          senderId,
          receiverId
        }
      })

      const receiverSockeId= await redis.get(`socket:${receiverId}`)
      if(receiverSockeId){
        io.to(receiverSockeId).emit("receivePrivateMessage",{
          ...message,
          content: await decompression(message.contentCompressed)
        })
      }else{
        await prisma.notification.create({
          data:{
            userID:receiverId,
            payload: {
              type:"PrivateMessage",
              contentCompressed:await Compression(content),
              senderId,
              receiverId,
              messageId: message.id
            },
            delivered:false
          }
        })
      }
    })

    socket.on("groupMessages",async({content,groupId,senderId,taggedUserIds=[]})=>{
      // console.log("groupMessages got hit")
      const message = await prisma.message.create({
        data: {
        contentCompressed:await Compression(content),
          senderId,
          groupId,
          taggedUsers: {
            connect: taggedUserIds.map(id => ({ id }))
          }
        },
        include: {
          taggedUsers: true
        }
      });
      // if(message){
      //   console.log("message created",message)
      // }
      const groupMembers= await prisma.groupUser.findMany({
        where:{groupId},
      })
      for(const member of groupMembers){
        if(member.memberId !== senderId){
          const memberSocketId= await redis.get(`socket:${member.memberId}`)
          const isTagged= taggedUserIds.includes(member.memberId)

          const payload={
            ...message,
            content:message.contentCompressed? await decompression(message.contentCompressed):null,
            isTagged
          }

          if(memberSocketId){
            // console.log("memberSocketId:",memberSocketId)
            io.to(memberSocketId).emit("receiveGroupMessage",payload)
          }else{
            await prisma.notification.create({
              data:{
                userID:member.memberId,
                payload:{
                  type:"GroupMessages",
                  groupId,
                  contentCompressed:await Compression(content),
                  isTagged
                },
                delivered:false
              }
            });
          }
        }
      }
    })

    socket.on("disconnect", async() => {
      const entries= await redis.keys("socket:*")
      for(const key of entries){
        const sid= await redis.get(key)
        if(sid=== socket.id){
          await redis.del(key)
          console.log(`🧹 Cleaned socket for ${key}`);
          break;
        }
      }
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

export { initSocket};
