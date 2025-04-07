import prisma from "../lib/prisma.js"
import { sendResponse } from "../utils/responder.js"


const userStats=async(req,res)=>{
    const {id}=req?.params
    
    try {
        const userdata=await prisma.users.findUnique({
            where:{id:id},
            include:{
                project:true,
                tasks:{
                    include:{
                        project:true
                    }
                },
                workingHourUser:{
                    select:{
                        duration:true
                    }
                }
            }
        })
        console.log(userdata)
        if(!userdata){
            return sendResponse({
                message:"Failed to Fetch users Data",
                res,
                statusCode:400,
                success:false,
                data:null
            })
        }
        return sendResponse({
            message:"User Data Fetched succesfully",
            res,
            statusCode:200,
            success:true,
            data:userdata
        })
        
        
    } catch (error) {
        console.log(error.message)
        return sendResponse({
            message:"Failed Fetch userStats",
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }
}

export{userStats}