import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const dashBoardNumbers=async(req,res)=>{
try {
    const [projectStats,totalProject,taskStats,employeeCount]= await Promise.all([
        prisma.project.groupBy({
            by:['status'],
            _count:{
                _all:true
            }
        }),
        prisma.project.count(),
        prisma.task.groupBy({
            by:['status'],
            _count:{
                _all:true
            }
        }),
        prisma.users.count()
    ])
    const response={
        totalProject,
        employeeCount,
        totalActiveProjects:0,
        totalCompleteProject:0,
        totalOnHoldProject:0,
        noOfCompleteTask:0,
        noOfAssignedTasks:0,
        noOfProgresstasks:0,
        noOfInReviewTasks:0,
        noOfInBreakTasks:0
    }
    projectStats.forEach(({status,_count})=>{
        if(status==='COMPLETE') response.totalCompleteProject=_count._all
        if(status==='ACTIVE') response.totalActiveProjects=_count._all
        if(status==='ONHOLD') response.totalOnHoldProject=_count._all
    })
    taskStats.forEach(({status,_count})=>{
        if(status==='COMPLETE') response.noOfCompleteTask=_count._all
        if(status==='ASSIGNED') response.noOfAssignedTasks=_count._all
        if(status==='IN_PROGRESS') response.noOfProgresstasks=_count._all
        if(status==='IN_REVIEW') response.noOfInReviewTasks=_count._all
        if(status==='BREAK') response.noOfInBreakTasks=_count._all
    })
    return sendResponse({
        message:"Stats data fetched successfully",
        res,
        statusCode:200,
        success:true,
        data:response
    })
} catch (error) {
    console.log(error.message)
    return sendResponse({
        message:error.message,
        res,
        statusCode:500,
        success:false,
        data:null
    })
}
}

export{dashBoardNumbers}