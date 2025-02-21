// Please navigate to very bottom of the file to know the logics in this file.

import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { isValidUUID } from "../utils/isValiduuid.js";
import { isAdmin } from "../middlewares/isadmin.js";

const AddTask = async (req, res) => {
  // Adding the task

  const {is_staff, id} = req.user

  console.log(req.body);

  const {
    description,
    due_date,
    duration,
    name,
    priority,
    project,
    user,
    status,
    start_date,
  } = req.body;

  console.log(
    description,
    due_date,
    duration,
    name,
    priority,
    project,
    user,
    status,
    start_date
  );

  if(!description || !name || !due_date || !duration || priority === undefined || !project || !user || !status || !start_date) {
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
        description,
        due_date,
        duration,
        name,
        priority,
        start_date,
        status,
        project_id: project,
        user_id: user,
      },
    });

    await prisma.project.update({
      where : {
        id : project
      },
      data : {
        status : "ACTIVE"
      }
    })

    const newAssigendTask= await prisma.assigned_list.create({
      data:{
          approved : is_staff ? false : true,
          assigned_to : user,
          assigned_by : id,
          task_id : newTask.id,
      }
  })

    if (newTask) {
      return sendResponse({
        message: "Task Added Successfully",
        res,
        statusCode: 200,
        success: true,
        data: newTask,
      });
    }
    sendResponse({
      message: "error in adding task",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  } catch (error) {
    console.log(error.message)
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
  console.log("I got hit on the getAllTasks");
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
    const tasks = await prisma.task.findMany({
      include: {
        project: {
          include: {
            manager: true,
          },
        },
        user: true,
        taskcomment: {
          include : {
            user : true,
            task : true
          }
        },
        assignedTask: true,
        taskInAssignedList: true,
        workingHourTask: true,
      },
    });

    console.log("--------------------------------------------", tasks);
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
      message: error.message,
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
      include: {
        project: true,
        taskcomment: true,
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
      data: {
        task,
      },
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

  console.log(req.body);

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
      message: error.message,
      res,
      statusCode: 500,
    });
  } finally {
    prisma.$disconnect();
  }
};

const calender = async (req, res) => {
  const { id: user_id, date } = req?.params;

  try {
    console.log("User ID:", user_id);
    if (!user_id) {
      return sendResponse({
        message: "Invalid userId",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    if (!isValidUUID(user_id)) {
      return sendResponse({
        message: "Invalid UUID",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const startDate = new Date(date);
    const endDate = new Date(date);

    if (isNaN(startDate.getTime())) {
      return sendResponse({
        message: "Invalid date",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    const taskFetched = await prisma.task.findMany({
      where: {
        user_id,
        created_on: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        project: true,
        fabricator: true,
      },
    });

    if (!taskFetched || taskFetched.length === 0) {
      return sendResponse({
        message: "No tasks found for the given date and user",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    return sendResponse({
      message: "Tasks fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: taskFetched,
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
    await prisma.$disconnect();
  }
};

const getMyTaskByIdAndStatus = async (req, res) => {
  const { id: user_id } = req?.user;

  if (!user_id) {
    return sendResponse({
      message: "Invalid userId",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  if (!isValidUUID(user_id)) {
    return sendResponse({
      message: "Invalid UUID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }
  try {
    const tasks = await prisma.task.findMany({
      where: {
        user_id: user_id,
      },
    });

    const filteredTasks = tasks.filter((t) => t.status !== "IN REVIEW");

    if (!tasks) {
      return sendResponse({
        message: "Failed to fetch My_tasks",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    if (tasks.length === 0) {
      return sendResponse({
        message: "No tasks found for this user with status 'ASSIGNED",
        res,
        statusCode: 200,
        success: true,
        data: tasks,
      });
    }
    return sendResponse({
      message: "My_tasks fetch success",
      res,
      statusCode: 200,
      success: true,
      data: filteredTasks,
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
    await prisma.$disconnect();
  }
};
const getAllTasksByUserId = async (req, res) => {
  const { id } = req?.user;
  const user = req.user;
  console.log("user=--==-====-==-===--==-=-=-=-=-=-=-=", user.is_superuser);

  if (!id) {
    return sendResponse({
      message: "Invalid userId",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    let tasks;
    if (user.is_superuser && user.is_staff && user.is_active) {
      tasks = await prisma.task.findMany();
    } else {
      tasks = await prisma.task.findMany({
        where: {
          user_id: id,
        },
        include: {
          workingHourTask: true,
          taskcomment: true,
        },
      });
    }

    if (!tasks) {
      return sendResponse({
        message: "Failed to fetch My_tasks",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    if (tasks.length === 0) {
      return sendResponse({
        message: "No tasks found for this user",
        res,
        statusCode: 200,
        success: true,
        data: tasks,
      });
    }
    return sendResponse({
      message: "All_tasks fetch success",
      res,
      statusCode: 200,
      success: true,
      data: tasks,
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
    await prisma.$disconnect();
  }
};

const getMyTaskRecords = async (req, res) => {
  const { id } = req?.user;

  if (!id) {
    return sendResponse({
      message: "Invalid userId",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const tasks = await prisma.task.findMany({
      where: {
        user_id: id,
      },
      include: {
        project: true,
        workingHourTask: true,
      },
    });

    if (!tasks) {
      return sendResponse({
        message: "Failed to fetch My_tasks",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    if (tasks.length === 0) {
      return sendResponse({
        message: "No tasks found for this user",
        res,
        statusCode: 200,
        success: true,
        data: tasks,
      });
    }
    return sendResponse({
      message: "My_tasks fetch success",
      res,
      statusCode: 200,
      success: true,
      data: tasks,
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
    await prisma.$disconnect();
  }
};

export {
  AddTask,
  DeleteTask,
  GetTask,
  GetTaskByID,
  UpdateTaskByID,
  calender,
  getMyTaskByIdAndStatus,
  getAllTasksByUserId,
  getMyTaskRecords,
};
