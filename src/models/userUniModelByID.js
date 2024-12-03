// src/models/userModel.ts
import prisma from "../lib/prisma.js"; // Import Prisma client

const getUserByID = async ({id}) => {
  try {
    const user  = await prisma.users.findUnique({
      where : {
        id
      }
    });
    return user
  } catch (error) {
    console.error("Error fetching users:", error);
    return null
  } finally {
    prisma.$disconnect()
  }
};

export {getUserByID}