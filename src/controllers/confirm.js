import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { isValidUUID } from "../utils/isValiduuid.js";

const getConfirmtaskById=async(req,res)=>{
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
    const confirm_list= await prisma.confirm.findUnique({
        where:{
            id
        }
    })
    if(!confirm_list){
        return sendResponse({
            message:"error in fetching the confirmtaskById",
            res,
            statusCode:403,
            success:false,
            data:null
        })
    }
    return sendResponse({
        message:"fetching the confirmtaskById succcess",
        res,
        statusCode:200,
        success:true,
        data:confirm_list
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
//id: assignedlist Task id in params
const postConfirmtaskById=async(req,res)=>{
    const {
        approved_on,
        assigned_on,
        approved,
        comment,
        assigned_task_id,
        assigned_by,
        assigned_to,
        approved_by
    } =req?.params
    if(
        !approved_on||
        !assigned_on||
        !approved||
        !comment||
        !assigned_task_id||
        !assigned_by||
        !assigned_to||
        approved_by
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
        const confirm_list= await prisma.confirm.create({
            data:{
                approved_on,
                assigned_on,
                approved,
                comment,
                assigned_task_id,
                assigned_by,
                assigned_to,
                approved_by
            }
        })
        if(!confirm_list){
            return sendResponse({
                message:"error in creating the confirmtaskById",
                res,
                statusCode:403,
                success:false,
                data:null
            })
        }
        return sendResponse({
            message:"fetching the confirmtaskById succcess",
            res,
            statusCode:200,
            success:true,
            data:confirm_list
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
const putConfirmtaskById=async(req,res)=>{
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
        const confirmassigned_list= await prisma.confirm.update({
            where:{
                id
            },
            data:req?.body
        });
        if(!confirmassigned_list){
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
            data:confirmassigned_list
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
const patchConfirmtaskById=async(req,res)=>{
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
        const confirmassigned_list= await prisma.confirm.update({
            where:{
                id
            },
            data:req?.body
        });
        if(!confirmassigned_list){
             return sendResponse({
                message:"error in patchupdating the taskById",
                res,
                statusCode:403,
                success:false,
                data:null
            })
        }
        return sendResponse({
            message:"patchupdated the taskById successfully",
            res,
            statusCode:200,
            success:true,
            data:confirmassigned_list
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
const deleteConfirmtaskById=async(req,res)=>{
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
    const confirmlistdeletetask= await prisma.confirm.delete({
        where:{
            id
        }
    })
    if(!confirmlistdeletetask){
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
        data:confirmlistdeletetask
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

export{
getConfirmtaskById,
postConfirmtaskById,
putConfirmtaskById,
patchConfirmtaskById,
deleteConfirmtaskById
}