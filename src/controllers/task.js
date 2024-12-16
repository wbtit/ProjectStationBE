import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { isValidUUID } from "../utils/isValiduuid.js";

const AddTask = async (req, res) => {

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

    
    return sendResponse({
      message: "Task Added Successfully",
      res,
      statusCode: 200,
      success: true,
      data: newTask,
    });
  } catch (error) {
   
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
};

const DeleteTask = async (req, res) => {
  
  const { id } = req?.params;

  try {
    const deletedTask = await prisma.task.delete({
      where: {
        id,
      },
    });
    if (!deletedTask) {

      sendResponse({
        message: "error in deleting task",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "Task deleted successfully",
      res,
      statusCode: 200,
      success: true,
      data: deletedTask,
    });
  } catch (error) {

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
};

const GetTask = async (req, res) => {


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
    const tasks = await prisma.task.findMany();
    if (!tasks) {
   
      return sendResponse({
        message: "error in fetching tasks",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "Tasks fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: tasks,
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

const GetTaskByID = async (req, res) => {

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

const UpdateTaskByID = async (req, res) => {


  const { id } = req?.params;



  try {
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

export {
  AddTask,
   DeleteTask,
   GetTask, 
   GetTaskByID, 
   UpdateTaskByID
}