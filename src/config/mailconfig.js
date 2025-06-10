// src/config/mailconfig.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
// Add these logs
console.log("--- Initializing Mail Transporter ---");
console.log("process.env.EMAIL:", process.env.EMAIL);
console.log("process.env.APP_PASSWORD:", process.env.APP_PASSWORD ? '*****' : 'undefined/empty'); // Mask password for security
console.log("-------------------------------------");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

export { transporter };