import newWBSActivity from "../../data/newWbsActivityData.js"
import newSubTasks  from    "../../data/newsubtaskdata.js"
import prisma from "../lib/prisma.js"

async function cloneWBSAndSubtasks(projectId,stage,prisma){
    try {
        console.log("Attempting to clone WBS and subtasks data...")
        const existingWBSActivities=await prisma.WBSActivity.findMany({
            where:{
                projectId:projectId,
                stage:stage
            }
        })
    } catch (error) {
        
    }
}