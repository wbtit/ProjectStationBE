// src/models/userModel.ts
import prisma from "../lib/prisma"; // Import Prisma client

export const getUserByUsername = async (username: string) => {
  return await prisma.users.findUnique({
    where: { username },
  });
};