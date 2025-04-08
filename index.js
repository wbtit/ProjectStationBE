
import dotenv from "dotenv";
import express from "express";
import { getUsers } from "./src/models/userAllModel.js";
import cors from "cors";
import { routes } from "./src/routes/index.js";
import { app } from "./src/app.js";
import { Server } from "socket.io";
import { createServer } from "http";
import {initSocket} from "./socket.js"

dotenv.config();

const server = createServer(app)
const io=new Server(server,{
  cors:{
    origin:"*"
  },
})

global.io = io;

initSocket(io)

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(
  cors({
    origin: "*",
    credentials: true,
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
 
const PORT = process.env.PORT || 5154;


server.listen(PORT, () => {
  console.log("Server is active on port", PORT);
});
