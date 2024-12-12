import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { BroadAccess } from "../../middlewares/broadaccess.js";

const router=Router()

router.delete("/:id",Authenticate, BroadAccess, async(req,res)=>{
    const {id}=req?.params
    try{
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