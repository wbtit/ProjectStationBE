import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function swapValues() {
    const subTasks = await prisma.subTasks.findMany();

    for (const task of subTasks) {
        await prisma.subTasks.update({
            where: { id: task.id },
            data: {
                execHr: task.unitTime,
                unitTime: task.execHr,
                checkHr: task.CheckUnitTime,
                CheckUnitTime: task.checkHr,
            },
        });
    }

    console.log("Values swapped successfully!");
}

swapValues()
    .catch((e) => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
