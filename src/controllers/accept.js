import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { isValidUUID } from "../utils/isValiduuid.js";

const TaskByIDAccept = async (req, res) => {

  const { id } = req?.params;

  try {
    if (!req.user) {

      return sendResponse({
        message: "User not authenticated",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }



    if (!id) {
      return sendResponse({
        message: "Invalid task ID",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }


    if (!isValidUUID(id)) {
      return sendResponse({
        message: "Invalid task UUid",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    });
    if (!task) {
      return sendResponse({
        message: "error in fetching task by id accept",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "Task by id  accept fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: task,
    });
  } catch (error) {

    return sendResponse({
      message: "Error in fetching task by id accept",
      res,
      statusCode: 500,
    });
  } finally {
    prisma.$disconnect();
  }
};

const UpdateTaskByIDs = async (req, res) => {

  const { id } = req?.params;


  try {
    if (!req.user) {
  
      return sendResponse({
        message: "User not authnticated",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }



    if (!id) {
      return sendResponse({
        message: "Invalid task ID",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }


    if (!isValidUUID(id)) {
      return sendResponse({
        message: "Invalid task UUid",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const task = await prisma.task.update({
      where: {
        id,
      },
      data: req?.body,
    });
    if (!task) {

      return sendResponse({
        message: "error in updating task by id accept",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "TaskbyID accept updated successfully",
      res,
      statusCode: 200,
      success: true,
      data: task,
    });
  } catch (error) {

    return sendResponse({
      message: "Error in fetching tasks",
      res,
      statusCode: 500,
    });
  } finally {
    prisma.$disconnect();
  }
};

export {TaskByIDAccept, UpdateTaskByIDs} 