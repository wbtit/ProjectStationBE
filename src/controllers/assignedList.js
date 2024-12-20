
// Please navigate to very bottom of the file to know the logics in this file.


import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { isValidUUID } from "../utils/isValiduuid.js";

const addAssignedList=async(req,res)=>{
    const {
        approved_on,
        assigned_on,
        approved,
        task_id,
        assigned_by,
        approved_by
    }=req.body
    if(!approved_on||
        !assigned_on||
        !approved||
        !task_id||
        !assigned_by||
        !approved_by
    ){
        sendResponse({
            message:"Fields are empty",
            res,
            statusCode:400,
            success:false,
            data:null

        })
    }
    try{
        const newAssigendTask= await prisma.assigned_list.create({
            data:{
                approved_on,
                assigned_on,
                approved,
                task_id,
                assigned_by,
                approved_by 
            }
        })
        if(newAssigendTask){
            return sendResponse({
                message:"Task added to Assigned list",
                res,
                statusCode:200,
                success:true,
                data:newAssigendTask
            })
        }
        return sendResponse({
            message:"error in adding task to Assigned list",
            res,
            statusCode:403,
            success:false,
            data:null
        })
    }catch(error){
        return sendResponse({
            message:error.message,
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }finally{
        prisma.$disconnect();
    }
}
const getAssignedList=async(req,res)=>{
    try{
        const assigned_list= await prisma.assigned_list.findMany();
        if(!assigned_list){
            sendResponse({
                message:"Error in getting assigned list",
                res,
                statusCode:403,
                success:false,
                data:null
            })
        }
         return sendResponse({
            message:"assigned list fetched successfully",
            res,
            statusCode:200,
            success:true,
            data:assigned_list
        })
}catch(error){
    return sendResponse({
        message:error.message,
        res,
        statusCode:500,
        success:false,
        data:null
    })
}finally{
    prisma.$disconnect();
}
}

const getAssignedListById=async(req,res)=>{
    const {id}=req?.params
    try{
        if(!id){
            return sendResponse({
                message:"Invalid ID",
                res,
                statusCode:400,
                success:false,
                data:null
            })
        }
        if(!isValidUUID(id)){
            return sendResponse({
                message: "Invalid task UUid",
                res,
                statusCode: 400,
                success: false,
                data: null,
              });
        }
        const assigned_list= await prisma.assigned_list.findUnique({
            where:{
                id
            }
        })
        if(!assigned_list){
             return sendResponse({
                message:"error in fetching the taskById",
                res,
                statusCode:403,
                success:false,
                data:null
            })
        }
        return sendResponse({
            message:"fetching the taskById succcess",
            res,
            statusCode:200,
            success:true,
            data:assigned_list
        })
    }catch(error){
        return sendResponse({
            message:error.message,
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }finally{
        prisma.$disconnect();
    }
}

const updateAssignedList=async(req,res)=>{
    const {id}=req?.params
    try{
        if(!id){
            return sendResponse({
                message:"Invalid ID",
                res,
                statusCode:403,
                success:false,
                data:null
            })
        }
        if(!isValidUUID(id)){
            return sendResponse({
                message: "Invalid task UUid",
                res,
                statusCode: 400,
                success: false,
                data: null,
              });
        }
        const assigned_list= await prisma.assigned_list.update({
            where:{
                id
            },
            data:req?.body
        });
        if(!assigned_list){
             return sendResponse({
                message:"error in updating the taskById",
                res,
                statusCode:403,
                success:false,
                data:null
            })
        }
        return sendResponse({
            message:"updated the taskById successfully",
            res,
            statusCode:200,
            success:true,
            data:assigned_list
        })
    }catch(error){
        return sendResponse({
            message:error.message,
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }finally{
        prisma.$disconnect();
    }
}
const deleteAssignedList=async(req,res)=>{
 const {id}=req?.params
 try{
    if(!id){
        return sendResponse({
            message:"Invalid ID",
            res,
            statusCode:400,
            success:false,
            data:null
        })
    }
    if(!isValidUUID(id)){
        return sendResponse({
            message:"Invalid uuid task",
            res,
            statusCode:400,
            success:false,
            data:null
        })
    }
    const deletetask= await prisma.assigned_list.delete({
        where:{
            id
        }
    })
    if(!deletetask){
        return sendResponse({
            message:"Error in deleting task",
            res,
            statusCode:403,
            success:false,
            data:null
        })
    }
    return sendResponse({
        message:"task deleted successfully",
        res,
        statusCode:200,
        success:true,
        data:deletetask
    })
 }catch(error){
    return sendResponse({
        message:error.message,
        res,
        statusCode:500,
        success:false,
        data:null
    })
 }finally{
    prisma.$disconnect()
 }
}

export {
    addAssignedList,
    getAssignedListById,
    getAssignedList,
    updateAssignedList,
    deleteAssignedList
}