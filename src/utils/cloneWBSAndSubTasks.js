import { describe } from "pm2"
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
            },
            select:{
                id:true,
                templateKey:true
            }
        })

    //get existingWBSActivities templateKey in set no duplicate values
    const existingWBSActivitiesTemplateKeys= existingWBSActivities= new Set(existingWBSActivities.map(a=>a.templateKey))

    //map the templateKey and id from the exsistingWBSActivities
    const existingWBSActivitiesIdMap= new Map(existingWBSActivities.map(a=>[a.templateKey,a.id]))
    const wbsActivityIdMap= new Map()

    //create new wbsActivity and map the id with old one
    for(const templateWBSActivity of newWBSActivity){
        if(!existingWBSActivitiesTemplateKeys.has(templateWBSActivity.templateKey)){
            const newWBSActivity= await prisma.WBSActivity.create({
                data:{
                    type:templateWBSActivity.type,
                    name:templateWBSActivity.name,
                    templateKey:templateWBSActivity.templateKey,
                    projectId:projectId,
                    stage:stage
                }
            })
            wbsActivityIdMap.set(templateWBSActivity.id,newWBSActivity.id)
            console.log(`Created WBSActivity: ${newWBSActivity.name} (ID: ${newWBSActivity.id}) for stage ${newStage}`);
        }else{
            const exsitingId=existingWBSActivitiesIdMap.get(templateWBSActivity.templateKey)
            wbsActivityIdMap.set(templateWBSActivity.id,exsitingId)
            console.log(`WBSActivity "${templateWBSActivity.name}" (templateKey: ${templateWBSActivity.templateKey}) already exists for project ${projectId} at stage ${newStage}. Skipping creation.`);
        }
    }

    //create new subtasks and relating them to corresponding wbsactivities
    // check for duplicates
    const existingSubtasks= await prisma.SubTasks.findMany({
        where:{
            projectId:projectId,
            stage:stage
        },
        select:{
            wbsactivityID:true,
            parentTemplateKey:true
        },
    })
    const existingSubTaskspairs= new Set(existingSubtasks.map(st=>`${st.wbsactivityID}-${st.parentTemplateKey}`))

    for( const templateSubTask of newSubTasks){
    
    const newOrExistingWBSActivityId=wbsActivityIdMap.get(templateSubTask.wbsactivityID)    
    if(newOrExistingWBSActivityId){
        const subTaskUniqueKey = `${newOrExistingWBSActivityId}-${templateSubTask.parentTemplateKey}`
        if(!existingSubTaskspairs.has(subTaskUniqueKey)){
            await prisma.SubTasks.create({
                data:{
                    description:templateSubTask.description,
                    stage:stage,
                    unitTime:templateSubTask.unitTime,
                    CheckUnitTime:templateSubTask.CheckUnitTime,
                    parentTemplateKey:templateSubTask.parentTemplateKey,
                    projectID:templateSubTask.projectID,
                    wbsactivityID:templateSubTask.wbsactivityID
                }
            })
            console.log("Created Subtasks")
        }else{
          console.log("Subtasks already exists")  
        }
    }else {
        console.warn(
          `WBSActivity with template ID ${templateSubTask.wbsactivityID} not found in mapping for project ${projectId} at stage ${newStage}. ` +
          `SubTask "${templateSubTask.description}" not created.`
        );
      }
    }

    console.log(`Finished processing WBSActivities and SubTasks for Project ${projectId} at stage ${newStage}.`);
    } catch (error) {
     console.error(`Error cloning WBS activities and subtasks:`, error);
    throw new Error('Failed to clone WBS activities and subtasks.');    
    }
}

export default cloneWBSAndSubtasks;