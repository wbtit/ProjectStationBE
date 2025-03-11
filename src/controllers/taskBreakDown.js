import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const addTaskBreakDown = async (req, res) => {
  const { description, QtyNo, execTime, checkingHour, projectId, activity } =
    req?.body;
  
  console.log(req.body);

  try {
    if (
      !description ||
      !QtyNo ||
      !execTime ||
      !checkingHour ||
      !projectId ||
      !activity
    ) {
      return sendResponse({
        message: "Empty inputs",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    const newtaskBreakDown = await prisma.taskBreakdown.create({
      data: {
        description,
        QtyNo,
        execTime,
        checkingHour,
        projectId,
        activity,
      },
    });
    if (!newtaskBreakDown) {
      return sendResponse({
        message: "Failed to create newTaskBreakDown",
        res,
        statusCode: 400,
        data: null,
        success: false,
      });
    }
    return sendResponse({
      message: "taskBreakDown Created Successfully",
      res,
      statusCode: 200,
      success: true,
      data: newtaskBreakDown,
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

const getTaskBreakDown = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendResponse({
      message: "Id not provided",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }
  try {
    const gettaskBreakDown = await prisma.taskBreakdown.findMany({
      where: {
        projectId: id,
      },
    });

    if (!gettaskBreakDown) {
      return sendResponse({
        message: "failed to fetch TaskBreakDowns",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "TaskBreakDowns fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: gettaskBreakDown,
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

const putTaskBreakDown = async (req, res) => {
  const { id } = req?.params;
  if (!id) {
    return sendResponse({
      message: "Id not provided",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }
  try {
    const puttaskBreakDown = await prisma.taskBreakdown.update({
      where: { id },
      data: rer.body,
    });
    if (!puttaskBreakDown) {
      return sendResponse({
        message: "Failed to update",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "Updated successfully",
      res,
      statusCode: 200,
      success: true,
      data: puttaskBreakDown,
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
export { addTaskBreakDown, getTaskBreakDown, putTaskBreakDown };
