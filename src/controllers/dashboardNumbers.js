import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const dashBoardNumbers = async (req, res) => {
  try {
    let projectFilter = {};
    let taskFilter = {};

    if(req.user.is_superuser || req.user.is_supermanager){

      // console.log("I am admin")
       projectFilter = {};
      taskFilter = {};

    }
    // If Project Manager, restrict to their projects only
    else if (req.user.is_manager && !req.user.is_staff) {
      projectFilter = { managerID: req.user.id };
      taskFilter = { project: { managerID: req.user.id } }; // filter tasks by project manager
    }
    // Dept manager
    else if(req.user.is_manager && req.user.is_staff){
const departments = await prisma.department.findMany({ where: { managerId: req.user.id }, select: { id: true }, }); 
const deptIds = departments.map(d => d.id); projectFilter = { departmentID: { in: deptIds } }; 
taskFilter = { project: { departmentID: { in: deptIds } } };
    }

    const [projectStats, totalProject, taskStats, totalNumberOfTasks, employeeCount] = await Promise.all([
      prisma.project.groupBy({
        by: ['status'],
        _count: { _all: true },
        where: projectFilter,
      }),
      prisma.project.count({ where: projectFilter }),
      prisma.task.groupBy({
        by: ['status'],
        _count: { _all: true },
        where: taskFilter,
      }),
      prisma.task.count({ where: taskFilter }),
      prisma.users.count(),
    ]);

    const response = {
      totalProject,
      employeeCount,
      totalNumberOfTasks,
      totalActiveProjects: 0,
      totalCompleteProject: 0,
      totalOnHoldProject: 0,
      noOfCompleteTask: 0,
      noOfAssignedTasks: 0,
      noOfProgresstasks: 0,
      noOfInReviewTasks: 0,
      noOfInBreakTasks: 0,
    };

    projectStats.forEach(({ status, _count }) => {
      if (status === 'COMPLETE') response.totalCompleteProject = _count._all;
      if (status === 'ACTIVE') response.totalActiveProjects = _count._all;
      if (status === 'ONHOLD') response.totalOnHoldProject = _count._all;
    });

    taskStats.forEach(({ status, _count }) => {
      if (status === 'COMPLETE') response.noOfCompleteTask = _count._all;
      if(status === 'COMPLETE_OTHER') response.noOfCompleteTask += _count._all;
      if(status === 'VALIDATE_COMPLETE') response.noOfCompleteTask += _count._all;
      if (status === 'ASSIGNED') response.noOfAssignedTasks = _count._all;
      if (status === 'IN_PROGRESS') response.noOfProgresstasks = _count._all;
      if (status === 'IN_REVIEW') response.noOfInReviewTasks = _count._all;
      if (status === 'BREAK') response.noOfInBreakTasks = _count._all;
    });

    return sendResponse({
      message: 'Stats data fetched successfully',
      res,
      statusCode: 200,
      success: true,
      data: response,
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


const dailyWorkingHours = async (req, res) => {
  const { id } = req.user;

  const now = new Date();

  // Use local date to match string in DB
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const startDateStr = formatDate(now);
  const endDateStr = formatDate(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));

  // Convert HH:MM:SS to hours
  function parseTimeToHours(timeStr) {
    if (!timeStr) return 0;
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      return hours + minutes / 60 + seconds / 3600;
    }
    if (parts.length === 2) {
      const [hours, minutes] = parts;
      return hours + minutes / 60;
    }
    return Number(timeStr) || 0;
  }

  try {
    // 1️⃣ Fetch today's tasks for the user
    const tasks = await prisma.task.findMany({
      where: {
        user_id: id,
        start_date: {
          gte: startDateStr,
          lt: endDateStr,
        },
      },
    });

    console.log("Tasks Today:", tasks);

    const totalAllocatedHours = tasks.reduce(
      (sum, t) => sum + parseTimeToHours(t.duration),
      0
    );

    const todayTaskIds = tasks.map(t => t.id);

    // 2️⃣ Sum working hours only for today's tasks
    const workedResult = todayTaskIds.length
      ? await prisma.workingHours.aggregate({
          _sum: { duration: true },
          where: { task_id: { in: todayTaskIds } },
        })
      : { _sum: { duration: 0 } };

    const totalWorkingHours = (workedResult._sum.duration || 0);

    console.log("totalAllocatedHours:", totalAllocatedHours);
    console.log("totalWorkingHours:", totalWorkingHours);

    // 3️⃣ Send response
    sendResponse({
      message: "Daily working hours fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: { totalAllocatedHours, totalWorkingHours },
    });
  } catch (error) {
    console.error(error);
    sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};






export{dashBoardNumbers,dailyWorkingHours}