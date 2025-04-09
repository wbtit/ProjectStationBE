// notification.js
import { userSocketMap } from "../../socket.js"

export const sendNotification = (userId, payload) => {
  const socketId = userSocketMap.get(userId);
  if (socketId && global.io) {
    (`Sending notification to socket ${socketId} for user ${userId}`);
    global.io.to(socketId).emit("customNotification", payload);
  } else {
    console.warn(`No socket found for userId: ${userId}`);
  }
};
