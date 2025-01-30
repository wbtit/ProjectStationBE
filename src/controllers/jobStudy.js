import { sendResponse } from "../utils/responder.js";
import prisma from "../lib/prisma.js";

const addJobStudy = async (req, res) => {
  const { QtyNo, execTime, unitTime, projectId } = req.body;

  try {
    if (!QtyNo || !execTime || !unitTime || !projectId) {
      return sendResponse({
        res,
        statusCode: 400,
        message: "Flieds are empty",
        success: false,
        data: null,
      });
    }

    const jobstudy = await prisma.jobStudy.create({
      data: {
        QtyNo: QtyNo,
        execTime: execTime,
        unitTime: unitTime,
        projectId: projectId,
      },
    });

    return sendResponse({
      message: "Job study added successfully",
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

const getJobStudy = async (req, res) => {
  try {
    const jobstudy = await prisma.jobStudy.findMany();

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
