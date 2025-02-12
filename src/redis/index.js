// // redisClient.js
// import { createClient } from "redis";

// const client = createClient();

// client.on("connect", () => {
//   console.log("Redis Client Connected Successfully");
// });

// client.on("error", (err) => {
//   console.error("Redis Client Error", err);
// });

// (async () => {
//   await client.connect(); // Ensure the Redis client is connected
// })();

// export default client;