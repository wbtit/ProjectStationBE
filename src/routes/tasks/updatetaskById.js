import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { isValidUUID } from "../../utils/isValiduuid.js"
import { BroadAccess } from "../../middlewares/broadaccess.js";

const router=Router();

router.put("/:id",Authenticate, BroadAccess, async(req,res)=>{
    const {id}=req?.params;

    try{
    
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
        console.log("error in updating task by id")
        return sendResponse({
            message:"error in updating task by id",
            res,
            statusCode:403,
            success:false,
            data:null
        });
    }
    return sendResponse({
        message:"TaskbyID updated successfully",
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