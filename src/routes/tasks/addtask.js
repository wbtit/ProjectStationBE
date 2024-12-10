import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";

const router = Router();

router.post("/", Authenticate, async (req, res) => {
  if (!req.user) {
    console.log("User Not Authenticated");
    return sendResponse({
      message: "User not authenticated",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }

  const { id, is_superuser } = req?.user;

  if (!is_superuser) {
    console.log("Only Admin can add tasks");
    return sendResponse({
      message: "Only admin can add task",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }

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
