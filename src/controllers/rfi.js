import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const addRFI=async (req,res)=>{
    const{id}=req.user
    const {
        fabricator_id,
        project_id,
        recepient_id,
        subject,
        description,
}=req.body
console.log(fabricator_id, project_id, recepient_id, subject, description)
try {
    if(!fabricator_id || !project_id || !recepient_id || !subject || !description){
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

const sentRFIByUser=async(req,res)=>{
    const {id}=req.user
try {
    const sentRFI= await prisma.rFI.findMany({
    where:{
        sender_id:id
    }
    })

    if(!sentRFI){
        return sendResponse({
            message:"Failed to get RFIs",
            res,
            statusCode:400,
            success:false,
            data:null
        })
    }
    return sendResponse({
        message:"Sent RFIs fetched success",
        res,
        statusCode:200,
        success:true,
        data:sentRFI
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
const Inbox=async(req,res)=>{
    const {id}=req.user
try {
    const sentRFI= await prisma.rFI.findMany({
    where:{
        recepient_id:id
    }
    })

    if(!sentRFI){
        return sendResponse({
            message:"Failed to get RFIs",
            res,
            statusCode:400,
            success:false,
            data:null
        })
    }
    return sendResponse({
        message:"Inbox RFIs fetched success",
        res,
        statusCode:200,
        success:true,
        data:sentRFI
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

const RFIseen=async(req,res)=>{
    const {id}=req?.params
    try{
        const rfiseen= await prisma.rFI.update({
            where:{
                id
            },
            data:{
                status:false
            }
        })
        if(!rfiseen){
            return sendResponse({
                message:"Failed to update",
                res,
                statusCode:500,
                success:false,
                data:null
            })
        }
        return sendResponse({
            message:"Status updated successfully",
            res,
            statusCode:200,
            success:true,
            data:rfiseen
        })
    }catch(error){
        return sendResponse({
            message:error.message,
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }
}

export{addRFI,sentRFIByUser,Inbox,RFIseen}