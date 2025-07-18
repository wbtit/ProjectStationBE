import prisma from "../src/lib/prisma.js";

async function deleteAllData() {
  try {
    const deletedSubTasks = await prisma.subTasks.deleteMany();
    console.log(`Deleted ${deletedSubTasks.count} SubTasks success`);

    const deletedWBSActivities = await prisma.wBSActivity.deleteMany();
    console.log(`Deleted ${deletedWBSActivities.count} WBSActivities success`);
  } catch (error) {
    console.error("Error deleting data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllData();
