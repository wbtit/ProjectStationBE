import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";

const router=Router()

router.delete("/:id",Authenticate,async(req,res)=>{
    try{
        if(!req.user){
            console.log("user not authenticated")
            return sendResponse({
                message:"User not authenticated",
                res,
                statusCode:403,
                success:false,
                data:null
            });
        }
    const deletedTask= await prisma.task.delete({
        where:{
            id
        }
    })
    if(!deletedTask){
        console.log("Error ind deleting the task")
        sendResponse({
            message:"error in deleting task",
            res,
            statusCode:403,
            success:false,
            data:null
        })
    }
    return sendResponse({
        message:"Task deleted successfully",
        res,
        statusCode:200,
        success:true,
        data:deletedTask
    })
    }catch(error){
    console.log(error.message);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
    }finally{
        prisma.$disconnect();
    }
})
export default router;