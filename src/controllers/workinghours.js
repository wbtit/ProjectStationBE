import { sendResponse } from "../utils/responder.js";
import prisma from "../lib/prisma.js";

const Start = async (req, res) => {
  const { id } = req.user;
  const { task_id } = req.body;

  // console.log(req.body);

  if (!task_id) {
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
        task_id:task_id,
        status:{notIn:["END"]}// Ensure previous work session is not still active
      },
      orderBy:{start:'desc'}
    })
    const task= await tx.task.findUnique({
      where:{
        id:task_id
      },select:{
        created_on:true
      }
    })
    if (existingWork) {
      if(new Date(existingWork.start)<new Date(task.created_on)){
        await tx.workingHours.update({
          where:{ user_id:id,
            task_id:task_id,
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
       task_id:task_id,
       start:new Date().toISOString(),
       duration:0,
       status:"START"
      },
    });

    await tx.task.update({
      where: {
        id: task_id,
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
  const { work_id, task_id } = req.body;

  // console.log(req.body);
  console.log("TaskId and WorkId:",work_id,task_id)

  if (!work_id || !task_id) {
    console.log("TaskId and WorkId:",work_id,task_id)
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
    const durationInMinutes=Math.floor((currentTimeStamp-startTimetask_idstamp)/60000)

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

    await tx.task.update({
      where: {
        id: task_id,
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
    console.log(error.message);
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
  const { work_id, task_id } = req.body;
  const { id } = req.user;
    console.log("Tatask_idskId and WorkId:",work_id,task_id)
  if (!work_id || !task_id) {
    console.log("TaskId and WorkId:",work_id,task_id)
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

    await tx.task.update({
      where: {
        id: task_id,
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
  const { work_id, task_id} = req.body;
  const { id } = req.user;

  if (!work_id || !task_id) {
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

    const task = await tx.task.findUnique({
      where: { id: task_id },
      select: { project_id: true },
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
      where: { id: task_id },
      data: { status: "IN_REVIEW" },
    });

    // Update project status to "ACTIVE"
    await tx.project.update({
      where: { id: task.project_id },
      data: { status: "ACTIVE" },
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

const getWork = async (req, res) => {
  const { id } = req.user;
  const { task_id } = req.params;

  // console.log(task_id);

  if (!task_id) {
    return sendResponse({
      message: "Invalid task_id",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const work = await prisma.workingHours.findFirst({
      where: {
        task_id: task_id,
        user_id: id,
      },
    });

    if (!work) {
      return sendResponse({
        message: "No work entry found for this user and task",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }
    let updatedDuration = work.duration; 
    // 🔹 Fix: Check if work exists before accessing its properties
    if ((work.status === "START" || work.status === "RESUME") && work.start) {
      const startTime = new Date(work.start).getTime();
      const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000);
      updatedDuration = work.duration + elapsedMinutes;
    }

    return sendResponse({
      message: "Work fetch success",
      res,
      statusCode: 200,
      success: true,
      data: { ...work, duration: updatedDuration }, // Return updated duration
    });
  } catch (error) {
    console.error("Error fetching work record:", error.message);
    return sendResponse({
      message: "Internal Server Error",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};


export { End, Pause, Resume, Start, getWork };
