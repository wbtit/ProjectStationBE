#!/bin/bash

gnome-terminal --tab --title="App1 Logs" -- bash -c "pm2 logs app1; exec bash" \
               --tab --title="App2 Logs" -- bash -c "pm2 logs app2; exec bash" \
               --tab --title="App3 Logs" -- bash -c "pm2 logs app3; exec bash"


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

    console.log("Fetching tasks for user:", req.user);

    const { is_manager, is_staff, id, user_id, is_superuser, departmentId } = req.user;
    let tasks = [];

    if (is_superuser) {
      // Superuser gets all tasks
      tasks = await prisma.task.findMany({
        include: {
          project: { include: { manager: true, department: true } },
          user: true,
          taskcomment: { include: { user: true, task: true } },
          assignedTask: true,
          taskInAssignedList: true,
          workingHourTask: true,
        },
      });
    } else if (is_manager && is_staff) {
      // Department Manager - fetch tasks from projects linked to their department
      tasks = await prisma.task.findMany({
        where: {
          project: {
            departmentId: departmentId, // Ensure project belongs to the manager's department
          },
        },
        include: {
          project: { include: { manager: true, department: true } },
          user: true,
          taskcomment: { include: { user: true, task: true } },
          assignedTask: true,
          taskInAssignedList: true,
          workingHourTask: true,
        },
      });
    } else if (is_manager) {
      // Project Manager - fetch tasks only for projects they manage
      tasks = await prisma.task.findMany({
        where: {
          project: {
            managerId: id, // Ensure the project is managed by the current user
          },
        },
        include: {
          project: { include: { manager: true, department: true } },
          user: true,
          taskcomment: { include: { user: true, task: true } },
          assignedTask: true,
          taskInAssignedList: true,
          workingHourTask: true,
        },
      });
    } else if (is_staff || user_id) {
      // Staff - fetch only tasks assigned to them
      tasks = await prisma.task.findMany({
        where: { user_id: user_id ?? id }, // Use nullish coalescing to handle undefined user_id
        include: {
          project: { include: { manager: true, department: true } },
          user: true,
          taskcomment: { include: { user: true, task: true } },
          assignedTask: true,
          taskInAssignedList: true,
          workingHourTask: true,
        },
      });
    } else {
      return sendResponse({
        message: "User has no assigned tasks",
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
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return sendResponse({
      message: "Internal Server Error",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};
