import prisma from "../lib/prisma.js"
import { sendResponse } from "../utils/responder.js"


const userStats=async(req,res)=>{
    const {id}=req?.params
    
    try {
        const userdata=await prisma.users.findUnique({
            where:{id:id},
            include:{
                project:{
                    select:{
                        name:true
                    }
                },
                tasks:true,
                workingHourUser:{
                    select:{
                        duration:true
                    }
                }
            }
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