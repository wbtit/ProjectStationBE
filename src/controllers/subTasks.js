import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const addSubTasks = async (req, res) => {
  const { description, Qty, unitTime, checkUnitTime, taskBreakdownid } =
    req.body;

  if (!description || !Qty || !unitTime || !checkUnitTime || !taskBreakdownid) {
    return sendResponse({
      message: "Fields are empty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const subtask = await prisma.subTasks.create({
      data: {
        description: description,
        Qty: Qty,
        CheckUnitTime: checkUnitTime,
        taskBreakDownid: taskBreakdownid,
        unitTime: unitTime,
      },
    });

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

const putSubTasksput = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return sendResponse({
      message: "Invalid ID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const subtask = await prisma.subTasks.update({
      where: {
        id: id,
      },
      data: req.body,
    });

    return sendResponse({
      message: "Subtask updated successfully",
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

const getSubTasks = async (req, res) => {
  try {
    const subtasks = await prisma.subTasks.findMany();

    return sendResponse({
      message: "subtasks feth succes",
      res,
      statusCode: 200,
      success: true,
      data: subtasks,
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

export { addSubTasks, getSubTasks, putSubTasksput };
