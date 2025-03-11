import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const getWbsActivity = async (req, res) => {
  const { type } = req.params;

  try {
    const wbsActivity = await prisma.wBSActivity.findMany({
      where: {
        type: type.toUpperCase(),
      },
    });

    return sendResponse({
      message: "WbsActivity found",
      res,
      statusCode: 200,
      success: true,
      data: wbsActivity,
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

const getAcivity = async (req, res) => {
  const activity = await prisma.wBSActivity.findMany();

  return sendResponse({
    message: "Success",
    res,
    statusCode: 200,
    success: true,
    data: activity,
  });
};

export { getWbsActivity, getAcivity };
