import prisma from "./src/lib/prisma.js";
import { WBSActivity } from "./data/activitydata.js";

const createTasks = async () => {
  try {
    await prisma.wBSActivity.createMany({
      data: WBSActivity,
      skipDuplicates: true, // Prevents duplicate entries
    });

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    await prisma.$disconnect();
  }
};

createTasks();
