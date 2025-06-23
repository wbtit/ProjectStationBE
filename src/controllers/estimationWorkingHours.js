import { sendResponse } from "../utils/responder.js";
import prisma from "../lib/prisma.js";

const Start = async (req, res) => {
  const { id } = req.user;
  const { estimationTaskId } = req.body;

  // console.log(req.body);

  if (!estimationTaskId) {
    return sendResponse({
      message: "Invalid task_id",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    await prisma.$transaction(async(tx)=>{
     // Check if an active work session already exists
    const existingWork= await tx.workingHours.findFirst({
      where:{
        user_id:id,
        estimationTask_id:estimationTaskId,
        status:{notIn:["END"]}// Ensure previous work session is not still active
      },
      orderBy:{start:'desc'}
    })
    const task= await tx.estimationTask.findUnique({
      where:{
        id:estimationTaskId
      },select:{
        createdAt:true
      }
    })
    if (existingWork) {
      if(new Date(existingWork.start)<new Date(task.createdAt)){
        await tx.workingHours.update({
          where:{ 
            user_id:id,
            estimationTask_id:estimationTaskId,
            status:{notIn:["END"]}},
          data:{status:"END"}
        })
      }else{
        return sendResponse({
          message: "A work session is already active for this task.",
          res,
          statusCode: 400,
          success: false,
          data: existingWork,
        });
      }
      
    }

    const workinghour = await tx.workingHours.create({
      data: {
       user_id:id,
       estimationTask_id:estimationTaskId,
       start:new Date().toISOString(),
       duration:0,
       status:"START"
      },
    });

    await tx.estimationTask.update({
      where: {
        id: estimationTaskId,
      },
      data: {
        status: "IN_PROGRESS",
      },
    });

    return sendResponse({
      message: "Work started.",
      res,
      statusCode: 200,
      success: true,
      data: workinghour,
    });})
  } catch (error) {
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};