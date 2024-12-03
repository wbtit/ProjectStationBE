import prisma from "../lib/prisma.js"; // Import Prisma client

export const getUserByUsername = async (username) => {
  try {
    const user  = await prisma.users.findUnique({
      where: { username },
    });
    return user
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users"); // Rethrow for higher-level handling
  } finally {
    prisma.$disconnect()
  }
};