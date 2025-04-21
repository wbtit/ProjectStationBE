import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import redis from "./redisClient.js";
import prisma from "./src/lib/prisma.js";


const userSocketMap = new Map();

const initSocket = async(io) => {

  const pubClient=createClient({url:"redis://127.0.0.1:6379"})
  const subClient=pubClient.duplicate()

  await pubClient.connect()
  await subClient.connect()

  io.adapter(createAdapter(pubClient,subClient))


  io.on("connection", (socket) => {
      console.log(`🔌 User connected socketId: ${socket.id}`);

    socket.on("joinRoom",async (userId) => {
      if (!userId) return;

      await redis.set(`socket:${userId}`,socket.id)
      console.log(`👤 User ${userId} joined. Socket ID mapped: ${socket.id}`);

      const pendingNotifications= await prisma.notification.findMany({
        where:{userID:userId,delivered:false}
      })
      for( const notification of pendingNotifications){
        global.io.to(socket.id).emit('customNotification',notification.payload)

        await prisma.notification.update({
          where:{id:notification.id},
          data:{delivered:true},
        })
      }
    });

    socket.on("privateMessages",async({content,senderId,receiverId})=>{

      const message= await prisma.message.create({
        data:{
          content,
          senderId,
          receiverId
        }
      })

      const receiverSockeId= await redis.get(`socket:${receiverId}`)
      if(receiverSockeId){
        io.to(receiverSockeId).emit("receivePrivateMessage",message)
      }else{
        await prisma.notification.create({
          data:{
            userID:receiverId,
            payload: {
              type:"PrivateMessage",
              content,
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
      const message = await prisma.message.create({
        data: {
          content,
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
      const groupMembers= await prisma.groupuser.findMany({
        where:{groupId},
      })
      for(const member of groupMembers){
        if(member.memberId !== senderId){
          const memberSocketId= await redis.get(`socket:${member.memberId}`)
          const isTagged= taggedUserIds.includes(member.memberId)

          const payload={
            ...message,
            isTagged
          }

          if(memberSocketId){
            io.to(memberSocketId).emit("receiveGroupMessage",payload)
          }else{
            await prisma.notification.create({
              data:{
                userID:member.memberId,
                payload:{
                  type:"GroupMessages",
                  groupId,
                  content,
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
