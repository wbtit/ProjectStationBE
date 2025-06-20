import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import createEstimationLineItem from "../utils/createEstimationLineItems.js";
import lineItems from "../../data/estimationLineItems.js";

//create the estimation
const createEstimation=async(req,res)=>{
const{
rfqId,
estimationNumber,
fabricatorName,
projectName,
estimateDate,
teklaOrSds,
fabricatorId,
assignedById,
}=req.body

try {
    if(
    rfqId||
    estimationNumber||
    fabricatorName||
    projectName||
    estimateDate||
    fabricatorId||
    assignedById){
        return sendResponse({
            message:"Fields are empty",
            res,
            statusCode:401,
            success:false,
            data:null
        })
    }
    const createEstimation = await prisma.Estimation.create({
        data:{
          rfqId,
          estimationNumber,
          fabricatorName,
          projectName,
          estimateDate,
          teklaOrSds,
          fabricatorId,
          assignedById,  
        }
    })
    return sendResponse({
        message:"estimation created successfully",
        res,
        statusCode:200,
        success:true,
        data:createEstimation
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
const getallEstimation=async(req,res)=>{
    try {
        const getallEstimation= await prisma.Estimation.findMany({
            include:{
             rfq:true,
             createdBy:true,
             tasks:true,
             lineItems:true,
             template:true 
            }
        })
        return sendResponse({
            message:"Estimations Fetched successfully",
            res,
            statusCode:200,
            success:true,
            data:getallEstimation
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
const getEstimationById=async(req,res)=>{
    const{estimationId}=req.params
    if(!estimationId){
        return sendResponse({
            message:"estimation is required",
            res,
            statusCode:401,
            success:false,
            data:null
        })
    }
    try {
        const getEstimationById= await prisma.Estimation.findUnique({
            where:{id:estimationId},
            include:{
                 rfq:true,
                 createdBy:true,
                 tasks:true,
                 lineItems:true,
                 template:true 
            }
        })
        return sendResponse({
            message:"estimation details fetched successfully",
            res,
            statusCode:200,
            success:true,
            data:getEstimationById
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
const updateEstimationData=async(req,res)=>{
    const{estimationId}=req.params
    if(!estimationId){
        return sendResponse({
            message:"estimation is required",
            res,
            statusCode:401,
            success:false,
            data:null
        })
    }
    try {
        const updateEstimationData= await prisma.Estimation.update({
            where:{id:estimationId},
            data:req?.body
        })
        return sendResponse({
            message:"Estimation data updated successfully",
            res,
            statusCode:200,
            success:true,
            data:updateEstimationData
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
const deleteEstimationData=async(req,res)=>{
    const{estimationId}=req.params
    if(!estimationId){
        return sendResponse({
            message:"estimation is required",
            res,
            statusCode:401,
            success:false,
            data:null
        })
    }
    try {
        const deleteData= await prisma.Estimation.delete({
            where:{id:estimationId}
        })
        return sendResponse({
            message:"Estimation Data Deleted successfully",
            res,
            statusCode:200,
            success:true,
            data:deleteData
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
const updateStatus=async(req,res)=>{
    const{estimationId,status}=req.params

    if(!estimationId || !status){
        return sendResponse({
            message:"estimation and status is required",
            res,
            statusCode:401,
            success:false,
            data:null
        })
    }
    try {
        const statusUpdated= await prisma.Estimation.update({
        where:{id:estimationId},
        data:{
            status:status
        }
    })
    return sendResponse({
        message:"Status got updated successfully",
        res,
        statusCode:200,
        success:true,
        data:statusUpdated
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
export {
    createEstimation,
    getallEstimation,
    getEstimationById,
    updateEstimationData,
    deleteEstimationData,
    updateStatus
}