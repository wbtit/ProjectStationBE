import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const addRFI=async (req,res)=>{
    const{id}=req.user
    const {
        fabricator_id,
        date,
        project_id,
        recepient_id,
        status,
        subject,
        description,
}=req.body
try {
    if(!fabricator_id||!project_id||!recepient_id||!subject||!description){
        return sendResponse({
            message:"Fields are empty",
            res,
            statusCode:400,
            success:false,
            data:null
        })
    }
    
} catch (error) {
    return sendResponse({
        message:error.message,
        res,
        statusCode:500,
        success:false,
        data:null
    })
}
}