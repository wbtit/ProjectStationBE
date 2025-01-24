import { sendResponse } from "../utils/responder.js";
import prisma from "../lib/prisma.js";

const Start = async (req, res) => {
  const { id } = req.user;
  const { task_id } = req.body;

  try {
    const workinghour = await prisma.workingHours.create({
      data: {
        start: Date.now(),
        status: "START",
        task_id: task_id,
        user_id: id,
      },
    });

    return sendResponse({
      message: "Work started.",
      res,
      statusCode: 200,
      success: true,
      data: workinghour,
    });
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
  const { work_id } = req.body;

  console.log(work_id);

  try {
    // Fetch the current `start` value from the database
    const workingHourRecord = await prisma.workingHours.findUnique({
      where: {
        id: work_id,
      },
    });

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
    const updatedWorkingHour = await prisma.workingHours.update({
      where: {
        id: work_id,
      },
      data: {
        duration: workingHourRecord.duration + durationInMinutes, // Store the duration in minutes as an integer
        status: "PAUSE",
      },
    });

    return sendResponse({
      message: `Work paused, Total time : ${
        workingHourRecord.duration + durationInMinutes
      } mins`,
      res,
      statusCode: 200,
      success: false,
      data: updatedWorkingHour,
    });
  } catch (error) {
    console.log(error.message)
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
  const { work_id } = req.body;
  const { id } = req.user;

  try {
    const work = await prisma.workingHours.findUnique({
      where: {
        id: work_id,
      },
    });

    if (work.user_id !== id) {
      return sendResponse({
        message: "Work not associated with the user",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }

    const workingupdate = await prisma.workingHours.update({
      where: {
        id: work_id,
      },
      data: {
        start: Date.now(),
        status: "RESUME",
      },
    });

    return sendResponse({
      message: `Work resumed, Total time: ${workingupdate.duration} mins`,
      res,
      statusCode: 200,
      success: true,
      data: workingupdate,
    });
  } catch (error) {
    console.log(error.message);
    return sendResponse({
      message: error,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const End = async (req, res) => {
  const { work_id } = req.body;
  const { id } = req.user;

  try {
    const workingHourRecord = await prisma.workingHours.findUnique({
      where: {
        id: work_id,
      },
    });

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
    const updatedWorkingHour = await prisma.workingHours.update({
      where: {
        id: work_id,
      },
      data: {
        duration: workingHourRecord.duration + durationInMinutes, // Store the duration in minutes as an integer
        status: "END",
      },
    });

    return sendResponse({
      message: `Work Ended, Total time : ${
        workingHourRecord.duration + durationInMinutes
      } mins`,
      res,
      statusCode: 200,
      success: false,
      data: updatedWorkingHour,
    });
  } catch (error) {
    console.log(error.message);
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
  const { task_id } = req.body;

  try {
    const work = await prisma.workingHours.findUnique({
      where: {
        user_id: id,
        task_id: task_id,
      },
    });

    return sendResponse({
      message: "Work fetch success",
      res,
      statusCode: 200,
      success: true,
      data: work,
    });
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

export { End, Pause, Resume, Start, getWork };
