import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { BroadAccess } from "../../middlewares/broadaccess.js";

const router = Router();

router.post("/", Authenticate,  BroadAccess, async (req, res) => {

  const {
    attachment,
    description,
    due_date,
    duration,
    name,
    priority,
    assignedTask,
    fabricator_id,
    project_id,
    user_id,
    status,
  } = req.body;

  console.log(
    attachment,
    description,
    due_date,
    duration,
    name,
    priority,
    fabricator_id,
    project_id,
    user_id,
    status
  );

  if (
    !description ||
    !due_date ||
    !duration ||
    !name ||
    !priority ||
    !fabricator_id ||
    !project_id ||
    !user_id ||
    !status
  ) {
    console.log("Fields are empty!");
    return sendResponse({
      message: "Fields are empty!!",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const newTask = await prisma.task.create({
      data: {
        attachment,
        description,
        due_date,
        duration,
        name,
        priority,
        fabricator_id,
        project_id,
        user_id,
        status,
      },
    });

    console.log("Task Added Successfully");
    return sendResponse({
      message: "Task Added Successfully",
      res,
      statusCode: 200,
      success: true,
      data: newTask,
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
  } finally {
    prisma.$disconnect();
  }
});

export default router;
