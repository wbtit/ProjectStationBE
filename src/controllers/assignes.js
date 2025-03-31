// Please navigate to very bottom of the file to know the logics in this file.

import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { isValidUUID } from "../utils/isValiduuid.js";

const addTaskAssignes = async (req, res) => {
  console.log("I got hit at addTaskAssignes");

  const { task_id } = req.params;
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",req.body)
  const {
    assigned_by,
    assigned_to,
    approved_by,
    approved_on = new Date(),
    assigned_on = new Date(),
    approved = false,
    comment = "",
  } = req.body;

  console.log("Task ID:", task_id);
  console.log("Request Body:", req.body);

  // Validate required fields
  if (!assigned_to) {
    return sendResponse({
      message: "assigned_to is  required!",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    console.log(req.user);
    if (!req.user) {
      return sendResponse({
        message: "User not authenticated",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }


    // Create new task assignment
    const assignment = await prisma.assignes.create({
      data: {
        approved_on,
        assigned_on,
        approved,
        comment,
        task: { connect: { id: task_id } },
        users: { connect: { id: req.user.id } }, // assigned_by → user
        user: { connect: { id: assigned_to } }, // assigned_to → user
        ...(approved_by && { approved_by }), // ✅ Only include if `approved_by` exists
      },
    });

    const newAssigendTask= await prisma.assigned_list.create({
      data:{
          approved_on:null,
          assigned_on,
          approved,
          task: { connect: { id: task_id } },
          users: { connect: { id: req.user.id } },
          userss: { connect: { id: assigned_to } },
          ...(approved_by && { approved_by }), // ✅ Only include if `approved_by` exists
      }
  })

    return sendResponse({
      message: "Task assigned successfully",
      res,
      statusCode: 200,
      success: true,
      data: assignment,
    });
  } catch (error) {
    console.error("Error assigning task:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};


const GetTaskByIDAssignes = async (req, res) => {
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

    const task = await prisma.assignes.findUnique({
      where: {
        id,
      },
    });
    if (!task) {
      return sendResponse({
        message: "error in fetching task by id",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "Task by id fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: task,
    });
  } catch (error) {
    return sendResponse({
      message: "Error in fetching task by id",
      res,
      statusCode: 500,
    });
  } finally {
    prisma.$disconnect();
  }
};

const updateTaskAssignes = async (req, res) => {
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
    if (!isValidUUID(id)) {
      return sendResponse({
        message: "Invalid task UUid",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const task = await prisma.assignes.update({
      where: { id },
      data: req.body,
    });
    if (!task) {
      return sendResponse({
        message: "error in updating task by id",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "TaskbyID updated successfully",
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

export { GetTaskByIDAssignes, addTaskAssignes, updateTaskAssignes };
