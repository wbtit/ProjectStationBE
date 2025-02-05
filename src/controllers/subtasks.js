import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const GetSubTasks = async (req, res) => {
  try {
    const { projectID, wbsactivityID } = req.params;

    const subtasks = await prisma.subTasks.findMany({
      where: {
        projectID,
        wbsactivityID,
      },
    });

    console.log("The subTasks", subtasks)

    sendResponse({
      message: "Subtasks fetch success",
      res,
      statusCode: 200,
      success: true,
      data: subtasks,
    });
  } catch (error) {
    sendResponse({
      message: "Subtasks fetch failed",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const UpdateSubTasks = async (req, res) => {
  const { subtaskid } = req.params;

  if (!subtaskid) {
    sendResponse({
      message: "Invalid ID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const subtasks = await prisma.subTasks.update({
      where: {
        id: subtaskid,
      },
      data: req.body,
    });
    sendResponse({
      message: "Subtasks update success",
      res,
      statusCode: 200,
      success: true,  
      data: subtasks,
    });
  } catch (error) {
    sendResponse({
      message: "Subtasks update failed",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

export { GetSubTasks, UpdateSubTasks };
