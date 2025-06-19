import prisma from "../lib/prisma.js"; // Prisma client singleton

export const getUserByUsername = async (username) => {
  try {
    const user = await prisma.users.findUnique({
      where: { username },
    });

    // Return user only if not disabled
    if (user && !user.is_disabled) {
      return user;
    }
    return null;

  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user");
  }
};
