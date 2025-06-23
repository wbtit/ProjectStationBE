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

const Pause = async (req, res) => {
  const { id } = req.user;
  const { work_id, estimationTaskId } = req.body;

  // console.log(req.body);
  console.log("TaskId and WorkId:",work_id,estimationTaskId)

  if (!work_id || !estimationTaskId) {
    console.log("TaskId and WorkId:",work_id,estimationTaskId)
    return sendResponse({
      message: "Invalid work_id or task_id",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    await prisma.$transaction(async(tx)=>{// Fetch the current `start` value from the database
    const workingHourRecord = await tx.workingHours.findUnique({
      where: {
        id: work_id,
      },
    });

    if (!workingHourRecord) {
      return sendResponse({
        message: "Work session not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    if (workingHourRecord.status === "PAUSE") {
      return sendResponse({
        message: "Work is already paused",
        res,
        statusCode: 400,
        success: false,
        data: workingHourRecord,
      });
    }

    if (!workingHourRecord.start) {
      return sendResponse({
        message: "Invalid Work session",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const startTimetask_idstamp= new Date(workingHourRecord.start).getTime()// convert starttime to time stamp
    const currentTimeStamp= Date.now()
    const durationInMinutes=Math.floor((currentTimeStamp-startTimestamp)/60000)

    // Update the duration in the database
    const updatedWorkingHour = await tx.workingHours.update({
      where: {
        id: work_id,
      },
      data: {
        duration: workingHourRecord.duration + durationInMinutes, // Store the duration in minutes as an integer
        status: "PAUSE",
      },
    });

    await tx.estimationTask.update({
      where: {
        id: estimationTaskId,
      },
      data: {
        status: "BREAK",
      },
    });

    return sendResponse({
      message: `Work paused, Total time : ${workingHourRecord.duration } mins`,
      res,
      statusCode: 200,
      success: false,
      data: updatedWorkingHour,
    });
  })
  } catch (error) {
    // console.log(error.message);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const Resume = async (req, res) => {
  const { work_id, estimationTaskId } = req.body;
  const { id } = req.user;
    console.log("Tatask_idskId and WorkId:",work_id,estimationTaskId)
  if (!work_id || !task_id) {
    console.log("TaskId and WorkId:",work_id,estimationTaskId)
    return sendResponse({
      message: "Invalid work_id or task_id",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    await prisma.$transaction(async(tx)=>{
    const work = await tx.workingHours.findUnique({
      where: {
        id: work_id,
      },
    });
    if (!work) {
      return sendResponse({
        message: "Work session not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }
    // console.log(work);

    if (work?.user_id !== id) {
      return sendResponse({
        message: "Work not associated with the user",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }

    if (work.status !== "PAUSE") {
      return sendResponse({
        message: "Work is not in a paused state",
        res,
        statusCode: 400,
        success: false,
        data: work,
      });
    }

    const workingupdate = await tx.workingHours.update({
      where: {
        id: work_id,
      },
      data: {
        start: new Date(),
        status: "RESUME",
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
      message: `Work resumed, Total time: ${workingupdate.duration} mins`,
      res,
      statusCode: 200,
      success: true,
      data: workingupdate,
    });
  })
  } catch (error) {
    // console.log(error.message);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const End = async (req, res) => {
  const { work_id, estimationTaskId} = req.body;
  const { id } = req.user;

  if (!work_id || !estimationTaskId) {
    return sendResponse({
      message: "Invalid work_id or task_id",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    await prisma.$transaction(async(tx)=>{
    const workingHourRecord = await tx.workingHours.findUnique({
      where: {
        id: work_id,
      },
    });
    if (!workingHourRecord) {
      return sendResponse({
        message: "Work session not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }
  
    if (workingHourRecord.user_id !== id) {
      return sendResponse({
        message: "Work not associated with the user",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }

    if (workingHourRecord.status === "END") {
      return sendResponse({
        message: `Work Ended, Total time : ${workingHourRecord.duration} mins`,
        res,
        statusCode: 200,
        success: true,
        data: workingHourRecord,
      });
    }

    if (workingHourRecord.user_id !== id) {
      return sendResponse({
        message: "Work not associated with the user",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }

    if (!workingHourRecord || !workingHourRecord.start) {
      return sendResponse({
        message: "Invalid Work",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const start = new Date(workingHourRecord.start).getTime(); // Convert start to timestamp in milliseconds
    const durationInMinutes = Math.floor((Date.now() - start) / 60000); // Calculate duration in minutes

    // Update the duration in the database
    const updatedWorkingHour = await tx.workingHours.update({
      where: {
        id: work_id,
      },
      data: {
        duration: workingHourRecord.duration + durationInMinutes, // Store the duration in minutes as an integer
        status: "END",
      },
    });

    const task = await tx.estimationTask.findUnique({
      where: { id: estimationTaskId },
    });

    if (!task) {
      return sendResponse({
        message: "Task not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    await tx.task.update({
      where: { id: estimationTaskId },
      data: { status: "UNDER_REVIEW" },
    });
    
    return sendResponse({
      message: `Work Ended, Total time : ${
        workingHourRecord.duration + durationInMinutes
      } mins`,
      res,
      statusCode: 200,
      success: true,
      data: updatedWorkingHour,
    })
  });
  } catch (error) {
    // console.log(error.message);
    return sendResponse({
      message: error,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};