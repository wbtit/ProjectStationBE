import {Route, Router} from "express"
import Authenticate from "../../middlewares/authenticate.js"
import prisma from "../../lib/prisma.js"
import { sendResponse } from "../../utils/responder.js"

const router=Router();

router.get('/:id',Authenticate,async(req,res)=>{
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
    const tasks=await prisma.task.findUnique({
        where:{
            id
        }
    });
    if(!tasks){
        console.log("error in fetching task by id")
        return sendResponse({
            message:"error in fetching task by id",
            res,
            statusCode:403,
            success:false,
            data:null
        });
    }
    return sendResponse({
        message:"Task by id fetched successfully",
        res,
        statusCode:200,
        success:true,
        data:tasks
    })
}catch(error){
    console.log("error in fetching task byh id",error)
    return sendResponse({
        message:"Error in fetching task by id",
        res,
        statusCode:500
    })
}finally{
    prisma.$disconnect();
}
})
export default router;