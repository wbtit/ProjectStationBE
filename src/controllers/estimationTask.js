import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const assignEstimationTask= async(req,res)=>{
const{estimationId}=req.params
    const{
        assignedToId,
        startDate,
        notes,
        endDate
    }=req.body
    const{id}=req.user
    if(!estimationId ||!assignedToId||!startDate||!endDate){
        console.log(req.body)
        return sendResponse({
            message:"Fields are required",
            res,
            statusCode:400,
            success:false,
            data:null
        })
    }
    try {
    const assignTask= await prisma.estimationTask.create({
        data:{
            estimation:{
               connect:{id:estimationId,} 
            },
            assignedTo:{
                connect:{id:assignedToId,}
            },
            
            assignedById:id,
            endDate:endDate,
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
    const{reviewNotes,status}=req.body
    const{id}=req.user
    try {
        if(!estimationTaskId||!status||!reviewNotes){
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
const getMyTasks=async(req,res)=>{
    const {id}=req.user
    try {
        if(!id){
        return sendResponse({
            message:"UserId is required",
            statusCode:400,
            success:false,
            data:null
        })
    }
    const my_tasks= await prisma.estimationTask.findMany({
        where:{
          assignedToId:id,
          status: { notIn: ["COMPLETED"] }  
        },
        include:{
            workinghours:true,
            estimation:true
        }
    })
    return sendResponse({
        message:"My tasks Fetched successfully",
        res,
        statusCode:200,
        success:true,
        data:my_tasks
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
               workinghours:true,
               comment:true
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


const updateTask=async(req,res)=>{
    const{estimationTaskId}=req.params
    if(!estimationTaskId){
            return sendResponse({
                message:"EstimationTaskId is required",
                res,
                statusCode:401,
                success:false,
                data:null
            })
        }
    try {
        const updateTaskData= await prisma.estimationTask.update({
            where:{id:estimationTaskId},
            data:req.body
        })
        return sendResponse({
            message:"Data updated successfully",
            res,
            statusCode:200,
            success:true,
            data:updateTaskData
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

const deletetask=async(req,res)=>{
    const{estimationTaskId}=req.params
    if(!estimationTaskId){
            return sendResponse({
                message:"EstimationTaskId is required",
                res,
                statusCode:401,
                success:false,
                data:null
            })
        }
        try {
            const deleteTask = await prisma.estimationTask.delete({
                where:{id:estimationTaskId},
            })
            return sendResponse({
                message:"Task got delete successfully",
                res,
                statusCode:200,
                success:true,
                data:deleteTask
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
export{
    assignEstimationTask,
    estimationTaskReview,
    getAllEstimationTasks,
    getEstimationTaskById,
    updateTask,
    deletetask,
    getMyTasks
}