// src/models/userModel.ts
import prisma from "../lib/prisma.js"; // Import Prisma client

export const getUserByUsername = async (username) => {
  return await prisma.users.findUnique({
    where: { username },
  });
};