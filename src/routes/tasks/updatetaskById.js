import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";

const router=Router();

router.put("/:id",Authenticate,async(req,res)=>{
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
    const {id}=req.params;
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
        console.log("error in fetching tasks",error)
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