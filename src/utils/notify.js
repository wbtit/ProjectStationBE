import redis from "../../redisClient.js";

export const sendNotification = async(userId, payload) => {
  const socketId = await redis.get(`socket:${userId}`)
  if (socketId && global.io) {
    console.log(`📢 Sending notification to socket ${socketId} for user ${userId}`);
    global.io.to(socketId).emit("customNotification", payload);
  } else {
    console.warn(`⚠️ No socket found for userId: ${userId}`);
  }
};