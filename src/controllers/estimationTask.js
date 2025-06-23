import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const assignEstimationTask= async(req,res)=>{
const{estimationId}=req.params
    const{
        assignedToId,
        startDate,
        notes,
    }=req.body
    const{id}=req.user
    if(!estimationId || assignedToId||!startDate){
        return sendResponse({
            message:"Fields are required",
            res,
            statusCode:401,
            success:false,
            data:null
        })
    }
    try {
    const assignTask= await prisma.estimationTask.create({
        data:{
            estimationId:estimationId,
            assignedTo:assignedToId,
            assignedById:id,
            startDate:startDate,
            notes:notes
        }
    })
    return sendResponse({
        message:"Task assigned successfully",
        res,
        statusCode:200,
        success:true,
        data:assignTask
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
const estimationTaskReview= async(req,res)=>{
    const{estimationTaskId}=req.params
    const{reviewNotes,status,endDate}=req.body
    const{id}=req.user
    try {
        if(!estimationTaskId||!status||!endDate||!reviewNotes){
            return sendResponse({
                message:"Fields are empty",
                res,
                statusCode:401,
                success:false,
                data:null
            })
        }
        const reviewTask =  await prisma.estimationTask.update({
            where:{id:estimationTaskId},
            data:{
                reviewNotes:reviewNotes,
                status:status,
                endDate:endDate,
                reviewedById:id
            },include:{
                estimation:true,
                assignedTo:true,
                reviewedBy:true
            }
        })
        return sendResponse({
            message:"Task reviews successfully",
            res,
            statusCode:200,
            success:true,
            data:reviewTask
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

const getAllEstimationTasks=async(req,res)=>{
    try {
        const getAllTasks= await prisma.estimationTask.findMany({
            include:{
               estimation:true,
               assignedTo:true,
               reviewedBy:true,
               workinghours:true
            }
        })
        return sendResponse({
            message:"Estimation Tasks fetched successfully",
            res,
            statusCode:200,
            success:true,
            data:getAllTasks
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

const getEstimationTaskById=async(req,res)=>{
    const{estimationTaskId}=req.params
    try {
        if(!estimationTaskId){
            return sendResponse({
                message:"EstimationTaskId is required",
                res,
                statusCode:401,
                success:false,
                data:null
            })
        }
        const getTaskById= await prisma.estimationTask.findUnique({
            where:{id:estimationTaskId},
            include:{
               estimation:true,
               assignedTo:true,
               reviewedBy:true,
               workinghours:true 
            }
        })
        return sendResponse({
            message:"TaskById fetched successfully",
            res,
            statusCode:200,
            success:true,
            data:getTaskById
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

//update task details
//delete task details
export{assignEstimationTask,
    estimationTaskReview,
    getAllEstimationTasks,
    getEstimationTaskById
}