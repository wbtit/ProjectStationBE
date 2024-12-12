import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { isValidUUID } from "../../utils/isValiduuid.js"

const router=Router();

router.put("/:id/accept",Authenticate,async(req,res)=>{
    const {id}=req?.params;

    try{
    if(!req.user){
        console.log("user not authenticated")
        return sendResponse({
            message:"User not authnticated",
            res,
            statusCode:403,
            success:false,
            data:null
        });
    }  
    
    console.log("id:",id)

    if(!id) {
        return sendResponse({
            message : "Invalid task ID",
            res ,
            statusCode : 400,
            success : false,
            data : null
        })
    }
    console.log(isValidUUID(id), typeof id)

    if(!isValidUUID(id))  {
        return sendResponse({
            message : "Invalid task UUid",
            res ,
            statusCode : 400,
            success : false,
            data : null
        })
    } 
    
    const task = await prisma.task.update({
        where : {
            id
        },
        data : req?.body
    })
    if(!task){
        console.log("error in updating task by id accept")
        return sendResponse({
            message:"error in updating task by id accept",
            res,
            statusCode:403,
            success:false,
            data:null
        });
    }
    return sendResponse({
        message:"TaskbyID accept updated successfully",
        res,
        statusCode:200,
        success:true,
        data:task
    })


    }catch(error){
        console.log("error in fetching tasks",error.message)
        return sendResponse({
            message:"Error in fetching tasks",
            res,
            statusCode:500
        })
    }finally{
        prisma.$disconnect();
    }
})

export default router;