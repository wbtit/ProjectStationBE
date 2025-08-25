import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const dashBoardNumbers = async (req, res) => {
  try {
    let projectFilter = {};
    let taskFilter = {};

    if(req.user.is_superuser){
      console.log("I am admin")
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


export{dashBoardNumbers}