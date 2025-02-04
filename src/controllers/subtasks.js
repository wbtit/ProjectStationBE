import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const GetSubTasks = async (req, res) => {
  const { projectID, wbsactivityID } = req.params;

  const subtasks = await prisma.subTasks.findMany({
    where: {
      projectID,
      wbsactivityID,
    },
  });

  sendResponse({
    message: "Subtasks fetch success",
    res,
    statusCode: 200,
    success: true,
    data: subtasks,
  });
};

export { GetSubTasks };
