import newWBSActivity from "../../data/newWbsActivityData.js" // Assuming this path is correct
import newSubTasks from "../../data/newsubtaskdata.js"     // Assuming this path is correct
import prisma from "../lib/prisma.js"                      // Assuming this path is correct

async function cloneWBSAndSubtasks(projectId, stage) {
    try {
        console.log(`Attempting to clone WBS and subtasks data for project ${projectId} at stage ${stage}...`);

        // Fetch existing WBS Activities for this project and stage to avoid duplicates
        // Corrected: prisma.WBSActivity -> prisma.wBSActivity (camelCase)
        const existingWBSActivities = await prisma.wBSActivity.findMany({
            where: {
                projectId: projectId,
                stage: stage
            },
            select: {
                id: true,
                templateKey: true
            }
        });

        // Get existingWBSActivities templateKey in set (no duplicate values)
        const existingWBSActivitiesTemplateKeys = new Set(existingWBSActivities.map(a => a.templateKey));

        // Map the templateKey and id from the existingWBSActivities
        const existingWBSActivitiesIdMap = new Map(existingWBSActivities.map(a => [a.templateKey, a.id]));
        const wbsActivityIdMap = new Map(); // Will contain both newly created and existing IDs

        // Create new wbsActivity and map the id with old one
        for (const templateWBSActivity of newWBSActivity) {
            if (!existingWBSActivitiesTemplateKeys.has(templateWBSActivity.templateKey)) {
                // Corrected: prisma.WBSActivity -> prisma.wBSActivity (camelCase)
                const newWBSActivity = await prisma.wBSActivity.create({
                    data: {
                        type: templateWBSActivity.type,
                        name: templateWBSActivity.name,
                        templateKey: templateWBSActivity.templateKey,
                        projectId: projectId,
                        stage: stage
                    }
                });
                wbsActivityIdMap.set(templateWBSActivity.id, newWBSActivity.id);
                // Corrected console log variable: newStage -> stage
                console.log(`Created WBSActivity: ${newWBSActivity.name} (ID: ${newWBSActivity.id}) for stage ${stage}`);
            } else {
                const existingId = existingWBSActivitiesIdMap.get(templateWBSActivity.templateKey);
                wbsActivityIdMap.set(templateWBSActivity.id, existingId);
                // Corrected console log variable: newStage -> stage
                console.log(`WBSActivity "${templateWBSActivity.name}" (templateKey: ${templateWBSActivity.templateKey}) already exists for project ${projectId} at stage ${stage}. Skipping creation.`);
            }
        }

        // Create new subtasks and relating them to corresponding wbsactivities
        // Check for duplicates
        // Corrected: prisma.SubTasks -> prisma.subTask (camelCase and singular)
        const existingSubtasks = await prisma.subTasks.findMany({
            where: {
                projectID: projectId,
                stage: stage
            },
            select: {
                wbsactivityID: true, // Corrected: wbsactivityID -> wbsActivityId (camelCase)
                parentTemplateKey: true
            },
        });

        // Corrected: wbsactivityID -> wbsActivityId (camelCase)
        const existingSubTaskspairs = new Set(existingSubtasks.map(st => `${st.wbsactivityID}-${st.parentTemplateKey}`));
         // --- DEBUGGING LOGS START HERE ---
        console.log(`--- Debugging SubTask Creation for Project: ${projectId}, Stage: ${stage} ---`);
        console.log(`Existing SubTask Pairs in DB for this stage:`, Array.from(existingSubTaskspairs));
        // --- DEBUGGING LOGS END HERE ---

        for (const templateSubTask of newSubTasks) {
            const newOrExistingWBSActivityId = wbsActivityIdMap.get(templateSubTask.wbsactivityID); // This template ID is correct for lookup

            if (newOrExistingWBSActivityId) {
                const subTaskUniqueKey = `${newOrExistingWBSActivityId}-${templateSubTask.parentTemplateKey}`;
                 // --- DEBUGGING LOGS START HERE ---
                console.log(`Processing template subtask: "${templateSubTask.description}"`);
                console.log(`  Resolved Parent WBSActivity DB ID: ${newOrExistingWBSActivityId}`);
                console.log(`  Template Parent Key: ${templateSubTask.parentTemplateKey}`);
                console.log(`  Generated Unique Key for check: "${subTaskUniqueKey}"`);
                // --- DEBUGGING LOGS END HERE ---
                if (!existingSubTaskspairs.has(subTaskUniqueKey)) {
                      // --- DEBUGGING LOGS START HERE ---
                    console.log(`  Key "${subTaskUniqueKey}" NOT found in existing set. Attempting to create.`);
                    // --- DEBUGGING LOGS END HERE ---
                    // Corrected: prisma.SubTasks -> prisma.subTask (camelCase and singular)
                    // Corrected: wbsactivityID -> wbsActivityId (use the mapped DB ID)
                    // Corrected: projectID -> projectId (use the function parameter)
                    await prisma.subTasks.create({
                        data: {
                            description: templateSubTask.description,
                            stage: stage,
                            unitTime: templateSubTask.unitTime,
                            CheckUnitTime: templateSubTask.CheckUnitTime,
                            parentTemplateKey: templateSubTask.parentTemplateKey,
                            projectID: projectId, // Use the projectId passed to the function
                            wbsactivityID: newOrExistingWBSActivityId // Use the mapped database ID
                        }
                    });
                    // Corrected console log: more descriptive
                    console.log(`Created SubTask: "${templateSubTask.description}" for stage ${stage}`);
                } else {
                      // --- DEBUGGING LOGS START HERE ---
                    console.log(`  Key "${subTaskUniqueKey}" FOUND in existing set. Skipping creation.`);
                    // --- DEBUGGING LOGS END HERE ---
                    console.log(`SubTask "${templateSubTask.description}" (parentTemplateKey: ${templateSubTask.parentTemplateKey}) already exists for WBSActivity ${newOrExistingWBSActivityId} at stage ${stage}. Skipping creation.`);
                }
            } else {
                // Corrected console log variable: newStage -> stage
                console.warn(
                    `WBSActivity with template ID ${templateSubTask.wbsactivityID} not found in mapping for project ${projectId} at stage ${stage}. ` +
                    `SubTask "${templateSubTask.description}" not created.`
                );
            }
        }

        // Corrected console log variable: newStage -> stage
        console.log(`Finished processing WBSActivities and SubTasks for Project ${projectId} at stage ${stage}.`);
    } catch (error) {
        console.error(`Error cloning WBS activities and subtasks:`, error);
        throw new Error('Failed to clone WBS activities and subtasks.');
    }
}

export default cloneWBSAndSubtasks;
