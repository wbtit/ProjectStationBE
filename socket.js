// socket.js
const userSocketMap = new Map();

const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log(`User connected socketId: ${socket.id}`);

    socket.on("joinRoom", (userId) => {
      if (!userId) return;

      userSocketMap.set(userId, socket.id);
       console.log(`User ${userId} joined. Socket ID mapped: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      for (const [userId, id] of userSocketMap.entries()) {
        if (id === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
     console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

export { initSocket, userSocketMap };
