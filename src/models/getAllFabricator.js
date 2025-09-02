import prisma from "../lib/prisma.js"; // Import Prisma client

export const getFabricators = async (createdById) => {
  try {
    // Fetch all users
    const users = await prisma.fabricator.findMany({
      where:{
        createdById:createdById
      },
      include:{
       userss:true 
      }
    });
    return users;
  } catch (error) {
      console.error("Error fetching users:", error);
      return []
  } finally {
    prisma.$disconnect();
  }
};
