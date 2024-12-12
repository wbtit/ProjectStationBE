
import {Router} from 'express'
import Authenticate from '../../middlewares/authenticate.js'
import prisma from '../../lib/prisma.js'
import { sendResponse } from '../../utils/responder.js'
import { isValidUUID } from '../../utils/isValiduuid.js'

const router=Router()

router.get("/:id/accept/",Authenticate,async(req,res)=>{
    const {id} =req?.params

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

    const task=await prisma.task.findUnique({
        where:{
            id
        }
    });
    if(!task){
        console.log("error in fetching task by id accept")
        return sendResponse({
            message:"error in fetching task by id accept",
            res,
            statusCode:403,
            success:false,
            data:null
        });
    }
    return sendResponse({
        message:"Task by id  accept fetched successfully",
        res,
        statusCode:200,
        success:true,
        data:task
    })
}catch(error){
    console.log("error in fetching task by id accept",error)
    return sendResponse({
        message:"Error in fetching task by id accept",
        res,
        statusCode:500
    })
}finally{
    prisma.$disconnect();
}
    })
export default router;
