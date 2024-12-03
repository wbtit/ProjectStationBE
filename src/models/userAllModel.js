import prisma from "../lib/prisma.js"; // Import Prisma client

export const getUsers = async () => {
    try {
        // Fetch all users
        const users = await prisma.users.findMany();
        return users;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users"); // Rethrow for higher-level handling
    } finally {
        prisma.$disconnect()
    }
};
