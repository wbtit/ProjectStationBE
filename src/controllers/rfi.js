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
    const fileDetails = req.files.map((file) => ({
        filename: file.filename, // UUID + extension
        originalName: file.originalname, // Original name of the file
        id: file.filename.split(".")[0], // Extract UUID from the filename
        path: `/public/rfitemp/${file.filename}`, // Relative path
      }));

 const newrfi= await prisma.rFI.create({
    data:{
        fabricator_id,
        date,
        project_id,
        recepient_id,
        sender_id:id,
        status:true,
        subject,
        description,
        files:fileDetails,

    },

 })
 if(!newrfi){
    return sendResponse({
        message:"Failed to create RFI",
        res,
        statusCode:400,
        success:false,
        data:null
    })
 }
 return sendResponse({
    message:"RFI added successfully",
    res,
    statusCode:200,
    success:true,
    data:newrfi
})

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

export{addRFI}