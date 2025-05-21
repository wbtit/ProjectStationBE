import prisma from "../src/lib/prisma.js";

async function deleteSubtasks (){
    await prisma.subTasks.deleteMany();
}
console.log("Subtasks got deleted")
deleteSubtasks();