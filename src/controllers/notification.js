import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const getNotifications=async(req,res)=>{
    const {userID}=req?.params

    try {
        const notifications= await prisma.notification.findMany({
            where:{
                userID
            }
        })
        if(notifications.length===0){
            return sendResponse({
                message:"Zero Notifications",
                res,
                statusCode:200,
                success:true,
                data:notifications
            })
        }
        return sendResponse({
            message:"Notification fetching successfully",
            res,
            statusCode:200,
            success:true,
            data:notifications
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

const markAsRead= async(req,res)=>{
 const {notificationID}=req.params
 try {
    const notification =await prisma.notification.update({
        where:{
            id:notificationID
        },
        data:{
            isRead:true
        }
    })
    if(!notification){
        return sendResponse({
            message:"failed to mark as Read",
            res,
            statusCode:400,
            success:false,
            data:null
        })
    }
    return sendResponse({
        message:"Notification marked as Read",
        res,
        statusCode:200,
        success:true,
        data:notification
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

const deleteNotifications=async(req,res)=>{
    const {notificationID}=req?.params
    try {
        const deletedNotification= await prisma.notification.delete({
            where:{
                id:notificationID
            }
        })
        if(!deletedNotification){
            return sendResponse({
                message:"Failed to delete the notification",
                res,
                statusCode:400,
                success:false,
                data:null
            })
        }
        return sendResponse({
            message:"Notification got deleted",
            res,
            statusCode:200,
            success:true,
            data:deletedNotification
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

export{getNotifications,markAsRead,deleteNotifications}