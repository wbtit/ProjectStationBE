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

const groupChatHistory=async(req,res)=>{
    const {groupId}=req.params
    try {
        if(!groupId){
        return sendResponse({
            message:"groupId is required",
            res,
            statusCode:500,
            success:false,
            data:null
        })
        }
        const groupMessages= await prisma.message.findMany({
            where:{groupId:groupId},
            include:{
                sender:true,
                taggedUsers :true,
            },
            orderBy:{createdAt:'desc'}
        })

        return sendResponse({
            message:"ChatHistory fetched successfully",
            res,
            statusCode:200,
            success:true,
            data:groupMessages
        })
    } catch (error) {
        console.log(error.message)
        return sendResponse({
            message:"Failed to load the Group ChatHistory",
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }
}
const privateChatHistory=async(req,res)=>{
    const{user1,user2}=req.params
    try {
        if(!user1 || user2){
            return sendResponse({
                message:"users IDs are required",
                res,
                statusCode:400,
                success:false,
                data:null
            })
        }
        const privateChats= await prisma.message.findMany({
            where:{
                or:[
                    {senderId:user1,receiverId:user2},
                    {senderId:user2,receiverId:user1},
                ]
            },
            include:{
                sender:true,
                receiver:true
            },
            orderBy:{createdAt:'desc'}
        })
    } catch (error) {
        return sendResponse({
            message:"Failed to load the Private ChatHistory",
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }
}
export{createGroup,addMemberToGroup,groupChatHistory}