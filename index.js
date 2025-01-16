import dotenv from "dotenv";
import express from "express";
import { getUsers } from "./src/models/userAllModel.js";
import cors from "cors";
import { routes } from "./src/routes/index.js";
import { app } from "./src/app.js";
import http from "http";
import pkg from "ws"; // Correct WebSocket import
import { WebSocketServer } from "ws";

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "You Summoned WBT Server",
    data: {
      reward: "Summon Success",
    },
  });
});

app.get("/getall", async (req, res) => {
  try {
    const users = await getUsers();
    console.log(users);
    res.status(200).json({
      message: "Success",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Unsuccess",
    });
  }
});

app.use("/api", routes);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const userSockets = {};

// WebSocket connection setup
wss.on("connection", (ws, req) => {
  const userId = req.url?.split("?userId=")[1];
  if (userId) {
    userSockets[userId] = ws;
    console.log(`User ${userId} connected`);

    ws.on("message", (message) => {
      console.log(`Message from user ${userId}: ${message}`);
    });

    ws.on("close", () => {
      console.log(`User ${userId} disconnected`);
      delete userSockets[userId];
    });
  }
});

// Add WebSocket instances to app locals
app.locals.wss = wss;
app.locals.userSockets = userSockets;

const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not set
server.listen(PORT, () => {
  console.log("Server is active on port ", PORT);
});
