import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";


const changeOrderReceived=async(req,res)=>{
    const {id}=req.user

    try{
        if(!id){
            return sendResponse({
                message:"Invalid userId",
                res,
                statusCode:411,
                success:false,
                data:null
            })
        }
        const receives= await prisma.changeOrder.findMany({
            where:{
                recipients:id
            },
            select:{
                remarks:true,
                description:true,
                changeOrder:true
            }
        })
    }
}