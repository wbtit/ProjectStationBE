import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import createEstimationLineItem from "../utils/createEstimationLineItems.js";



//create the estimation
const createEstimation=async(req,res)=>{
const{
rfqId,
estimationNumber,
fabricatorName,
projectName,
estimateDate,
tools,
fabricatorId,
}=req.body

const{id}=req.user
console.log("==============The creatdeBy Id fo the Estimation:",id)

try {

    if(
    !rfqId||
    !estimationNumber||
    !fabricatorId||
    !projectName||
    !estimateDate
    ){
        return sendResponse({
            message:"Fields are empty",
            res,
            statusCode:401,
            success:false,
            data:null
        })
    }
    const createEstimation = await prisma.estimation.create({
        data:{
          rfq:{
            connect:{id:rfqId}
          },
          createdBy:{
            connect:{id:id}
          },
          estimationNumber,
          fabricatorName,
          projectName,
          estimateDate,
          tools,
          fabricators:{
            connect:{id:fabricatorId}
          },
          assignedById:id,
        }
    })

    await createEstimationLineItem(createEstimation.id)
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
        const getallEstimation= await prisma.estimation.findMany({
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
        const getEstimationById= await prisma.estimation.findUnique({
            where:{id:estimationId},
            include:{
                 rfq:true,
                 createdBy:true,
                 tasks:true,
                 lineItems:true,
                 template:true ,
                 fabricators:true
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
        const updateEstimationData= await prisma.estimation.update({
            where:{id:estimationId},
            data:{            
                estimationNumber ,
                fabricatorName,   
                projectName,      
                estimateDate,     
                tools,       
                status,           
                createdById,      
                fabricatorId,     
                assignedById,     
                finalHours,       
                finalWeeks       
            },
            include:{
                 rfq:true,
                 createdBy:true,
                 tasks:true,
                 lineItems:true,
                 template:true 
            }
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
        const deleteData= await prisma.estimation.delete({
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
        const statusUpdated= await prisma.estimation.update({
        where:{id:estimationId},
        data:{
            status:status
        },include:{
                 rfq:true,
                 createdBy:true,
                 tasks:true,
                 lineItems:true,
                 template:true 
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

const setFinalPrice=async(req,res)=>{
    const{estimationId}=req.params
    const{finalPrice}=req.body
    if(!finalPrice){
        return sendResponse({
            mesetFinalPricessage:"Final Price is required",
            res,
            statusCode:401,
            success:false,
            data:null
        })
    }
    try {
        const setPrice = await prisma.estimation.update({
            where:{id:estimationId},
            data:{
                finalPrice:finalPrice
            },include:{
                rfq:true,
                createdBy:true,
                tasks:true,
                lineItems:true,
                template:true  
            }
        })
        return sendResponse({
            message:"Final Price is updated",
            res,
            statusCode:200,
            success:true,
            data:setPrice
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
    updateStatus,
    setFinalPrice
}