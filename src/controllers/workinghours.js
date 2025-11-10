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
    console.log(`[LOG] Start: Received request to start work for task_id: ${task_id} by user: ${id}`);
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
        console.log(`[LOG] Start: Found old work session ${existingWork.id} for task ${task_id}. Updating its status to END.`);
        await tx.workingHours.update({
          where:{ user_id:id,
            task_id:task_id,
            status:{notIn:["END"]}},
          data:{status:"END"}
        })
      }else{
        console.log(`[LOG] Start: Aborting. An active work session ${existingWork.id} already exists for this task.`);
        return sendResponse({
          message: "A work session is already active for this task.",
          res,
          statusCode: 400,
          success: false,
          data: existingWork,
        });
      }
      
    }

    console.log(`[LOG] Start: Creating new working hour for user ${id} on task ${task_id} with status START.`);
    const workinghour = await tx.workingHours.create({
      data: {
       user_id:id,
       task_id:task_id,
       start:new Date().toISOString(),
       duration:0,
       status:"START"
      },
    });

    console.log(`[LOG] Start: Updating task ${task_id} status to IN_PROGRESS.`);
    await tx.task.update({
      where: {
        id: task_id,
      },
      data: {
        status: "IN_PROGRESS",
      },
    });

    console.log(`[LOG] Start: Successfully started work. Responding to client.`);
    return sendResponse({
      message: "Work started.",
      res,
      statusCode: 200,
      success: true,
      data: workinghour,
    });})
  } catch (error) {
    console.error(`[ERROR] Start: Failed to start work for task_id: ${task_id}. Error: ${error.message}`);
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

  console.log(`[LOG] Pause: Received request to pause work_id: ${work_id} for task_id: ${task_id}`);

  try {
    const updatedWorkingHour = await prisma.$transaction(async (tx) => {
      // Fetch the current `start` value from the database
      const workingHourRecord = await tx.workingHours.findUnique({
        where: {
          id: work_id,
        },
      });

      if (!workingHourRecord) {
        // Throw an error to be caught outside the transaction
        throw new Error("Work session not found");
      }
      if(workingHourRecord.status==="PAUSE"){
        throw new Error("Work is already paused");
      }

      if (!workingHourRecord.start) {
        throw new Error("Invalid Work session: start time is missing.");
      }

      const startTimestamp = new Date(workingHourRecord.start).getTime(); // convert starttime to time stamp
      const currentTimeStamp = Date.now();
      const durationInMinutes = Math.floor((currentTimeStamp - startTimestamp) / 60000);

      // Update the duration in the database
      console.log(`[LOG] Pause: Updating working hour ${work_id} status to PAUSE.`);
      const updatedRecord = await tx.workingHours.update({
        where: {
          id: work_id,
        },
        data: {
          duration: workingHourRecord.duration + durationInMinutes, // Store the duration in minutes as an integer
          status: "PAUSE",
        },
      });

      console.log(`[LOG] Pause: Updating task ${task_id} status to BREAK.`);
      await tx.task.update({
        where: {
          id: task_id,
        },
        data: {
          status: "BREAK",
        },
      });

      return updatedRecord;
    });
    

    console.log(`[LOG] Pause: Successfully paused work ${work_id}. Responding to client.`);
    return sendResponse({
      message: `Work paused, Total time : ${updatedWorkingHour.duration} mins`,
      res,
      statusCode: 200,
      success: true,
      data: updatedWorkingHour,
    });
  } catch (error) {
    console.error(`[ERROR] Pause: Failed to pause work ${work_id}. Error: ${error.message}`);
    // Handle specific errors thrown from the transaction
    if (error.message === "Work session not found") {
      return sendResponse({ message: error.message, res, statusCode: 404, success: false });
    }
    if (error.message === "Work is already paused" || error.message.startsWith("Invalid Work session")) {
      return sendResponse({ message: error.message, res, statusCode: 400, success: false });
    }

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
  console.log(`[LOG] Resume: Received request to resume work_id: ${work_id} for task_id: ${task_id}`);
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
      console.log(`[LOG] Resume: Aborting. Work ${work_id} is not in PAUSE state. Current status: ${work.status}.`);
      return sendResponse({
        message: "Work is not in a paused state",
        res,
        statusCode: 400,
        success: false,
        data: work,
      });
    }

    console.log(`[LOG] Resume: Updating working hour ${work_id} status to RESUME.`);
    const workingupdate = await tx.workingHours.update({
      where: {
        id: work_id,
      },
      data: {
        start: new Date(),
        status: "RESUME",
      },
    });

    console.log(`[LOG] Resume: Updating task ${task_id} status to IN_PROGRESS.`);
    await tx.task.update({
      where: {
        id: task_id,
      },
      data: {
        status: "IN_PROGRESS",
      },
    });

    console.log(`[LOG] Resume: Successfully resumed work ${work_id}. Responding to client.`);
    return sendResponse({
      message: `Work resumed, Total time: ${workingupdate.duration} mins`,
      res,
      statusCode: 200,
      success: true,
      data: workingupdate,
    });
  })
  } catch (error) {
    console.error(`[ERROR] Resume: Failed to resume work ${work_id}. Error: ${error.message}`);
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
  const { work_id, task_id, end } = req.body;
  const { id } = req.user;
  if (!work_id || !task_id) {
    console.log(`[LOG] End: Received request to end work_id: ${work_id} for task_id: ${task_id}`);
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
      console.log(`[LOG] End: Aborting. Work ${work_id} is already in END state.`);
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

    const startTime = new Date(workingHourRecord.start).getTime();
    // Use the client-provided 'end' time for a more accurate calculation. Fallback to server time.
    const endTime = end ? new Date(end).getTime() : Date.now();

    const durationInMinutes = Math.floor((endTime - startTime) / 60000); // Calculate duration in minutes

    // Update the duration in the database
    console.log(`[LOG] End: Updating working hour ${work_id} status to END.`);
    const updatedWorkingHour = await tx.workingHours.update({
      where: {
        id: work_id,
      },
      data: {
        duration: workingHourRecord.duration + durationInMinutes, // Store the duration in minutes as an integer
        status: "END",
        end: new Date(endTime) // Use the calculated end time
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

    console.log(`[LOG] End: Updating task ${task_id} status to IN_REVIEW.`);
    await tx.task.update({
      where: { id: task_id },
      data: { status: "IN_REVIEW" },
    });

    console.log(`[LOG] End: Updating project ${task.project_id} status to ACTIVE.`);
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
    console.error(`[ERROR] End: Failed to end work ${work_id}. Error: ${error.message}`);
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


const getReWorkDuration = async (req, res) => {
  const { work_id, task_id } = req.body;

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
    const task = await prisma.task.findUnique({
      where: { id: task_id }
    });

    

    if (!task || !work || !work.end || !task.reworkStartTime) {
      return sendResponse({
        message: "Task or Work record not found or missing dates",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    const start = new Date(task.reworkStartTime);
    const end = new Date(work.end);
    console.log("strat: ",start)
    console.log("end: ",end)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return sendResponse({
        message: "Invalid date values",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const ms = end - start;
    const minutes = Math.floor(ms / (1000 * 60));
    //console.log("-=-=-=-",minutes)

    return sendResponse({
      message: "Rework duration fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: { minutes },
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
const updateWorkingHours = async (req, res) => {
  try {
    console.log(`[LOG] updateWorkingHours: Received request to manually update work_id: ${req.params.id}`);
    const { id } = req.params;
    const {
      status,
      start,
      end,
      duration,
      task_id,
      estimationTask_id,
    } = req.body;

    // Update working hour
    console.log(`[LOG] updateWorkingHours: Updating working hour ${id} with status: ${status}`);
    const updatedWorkingHour = await prisma.workingHours.update({
      where: { id },
      data: {
        status,
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
        duration,
        task_id,
        estimationTask_id,
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedWorkingHour,
    });
  } catch (error) {
    console.error(`[ERROR] updateWorkingHours: Failed to update work ${req.params.id}. Error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Failed to update working hour",
      error: error.message,
    });
  }
};



export { End, Pause, Resume, Start, getWork,getReWorkDuration,updateWorkingHours};
