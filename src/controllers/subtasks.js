
import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const addSubTasks = async (req, res) => {
  const {projectID,wbsactivityID}=req.params
  const { description, Qty, execHr, checkHr } =
    req.body;   
  console.log("Subtasks00000000000000000000000000000000000000000",req.body)
  if (!description || !Qty || !execHr || !checkHr ||!projectID||!wbsactivityID) {
    return sendResponse({
      message: "Fields are empty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const subtask= await prisma.subTasks.createMany({
      data:Object.values(req.body).map((task)=>({
        description:task.description,
        Qty:task.Qty,
        execHr:task.execHr,
        checkHr:task.checkHr,
        projectID:task.projectID,
        wbsactivityID:task.wbsactivityID
      }))
    })

    return sendResponse({
      message: "Subtask added successfully",
      res,
      statusCode: 200,
      success: true,
      data: subtask,
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

export { GetSubTasks, UpdateSubTasks,addSubTasks};
