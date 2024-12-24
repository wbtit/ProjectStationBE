import prisma from "../lib/prisma.js"; // Import Prisma client

export const getDepartments = async () => {
  try {
    // Fetch all users
    const departments = await prisma.department.findMany({
      include: {
        manager: true,
        createdBy: true,
      },
    });
    return departments;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  } finally {
    prisma.$disconnect();
  }
};
