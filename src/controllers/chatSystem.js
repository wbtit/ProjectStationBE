import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const createGroup=async(req,res)=>{
    const{name}=req.body
    const{id}=req.user
    try {
        if(!name){
           return sendResponse({
                message:"Enter a Group name",
                res,
                statusCode:400,
                success:false,
                data:null
            })
        }
        const newGroup= await prisma.group.create({
            data:{
                name:name,
                adminId:id
            }
        })
        return sendResponse({
            message:"Create a group successfully",
            res,
            statusCode:200,
            success:true,
            data:newGroup
        })
    } catch (error) {
        console.log(error)
        return sendResponse({
            message:"Failed to Create a group",
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }
}

const addMemberToGroup=async(req,res)=>{
    const{memberId}=req.body
    const{groupId}=req.params
    try {
        if(!memberId || groupId){
            return sendResponse({
                message:"Please provide memberId and groupId",
                res,
                statusCode:400,
                success:false,
                data:null
            })
        }
        const membership=  await prisma.groupuser.create({
            data:{
                memberId:memberId,
                groupId:groupId
            }
        })
        return sendResponse({
            message:"User Added successfully",
            res,
            statusCode:200,
            success:true,
            data:membership
        })
    } catch (error) {
        console.log(error.message)
        return sendResponse({
            message:"Failed to add member to group",
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }
}
export{createGroup,addMemberToGroup}