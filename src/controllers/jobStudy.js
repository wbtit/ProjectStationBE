import { sendResponse } from "../utils/responder.js";
import prisma from "../lib/prisma.js";

const addJobStudy = async (req, res) => {
  // console.log(req.body);

  try {
    if (!req.body) {
      return sendResponse({
        res,
        statusCode: 400,
        message: "Flieds are empty",
        success: false,
        data: null,
      });
    }

    const jobstudy = await prisma.jobStudy.createMany({
      data: Object.values(req.body).map((task) => ({
        description: task.description,
        QtyNo: task.QtyNo, // Ensure QtyNo is an integer
        unitTime: task.unitTime,
        execTime: task.execTime,
        projectId: task.projectId,
      })),
    });

    return sendResponse({
      message: "Job study added successfully",
      res,
      statusCode: 200,
      success: true,
      data: jobstudy,
    });
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

const getJobStudy = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return sendResponse({
      message: "Ivalid ID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }
  try {
    const jobstudy = await prisma.jobStudy.findMany({
      where: {
        projectId: id,
      },
    });

    return sendResponse({
      message: "Job study fetch success",
      res,
      statusCode: 200,
      success: true,
      data: jobstudy,
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

const putJobStudy = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return sendResponse({
      message: "Ivalid ID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const jobstudy = await prisma.jobStudy.update({
      where: {
        id: id,
      },
      data: req.body,
    });

    return sendResponse({
      message: "Job study updated",
      res,
      statusCode: 200,
      success: true,
      data: jobstudy,
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

export { addJobStudy, getJobStudy, putJobStudy };
