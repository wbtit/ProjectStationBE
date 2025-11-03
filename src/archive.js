import prisma from "./lib/prisma";

export async function archiveTasksInDateRange() {
  try {
    const startDate = new Date("2025-03-05T00:00:00.000Z");
    const endDate = new Date("2025-07-31T23:59:59.999Z");

    const result = await prisma.task.updateMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      data: {
        isArchive: true,
      },
    });

    console.log(`✅ ${result.count} tasks archived between March and July 2025.`);
  } catch (error) {
    console.error("❌ Error archiving tasks:", error);
  }
}
archiveTasksInDateRange()

