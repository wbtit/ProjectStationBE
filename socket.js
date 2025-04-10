import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";

const userSocketMap = new Map();

const initSocket = async(io) => {

  const pubClient=createClient({url:"redis://127.0.0.1:6379"})
  const subClient=pubClient.duplicate()

  await pubClient.connect()
  await subClient.connect()

  io.adapter(createAdapter(pubClient,subClient))


  io.on("connection", (socket) => {
      console.log(`🔌 User connected socketId: ${socket.id}`);

    socket.on("joinRoom", (userId) => {
      if (!userId) return;

      userSocketMap.set(userId, socket.id);
      console.log(`👤 User ${userId} joined. Socket ID mapped: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const [userId, id] of userSocketMap.entries()) {
        if (id === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });
};

export { initSocket, userSocketMap };
