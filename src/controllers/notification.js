import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const getNotificationsByUserId = async (req, res) => {
    const { id } = req.user;
    try {
        const notifications = await prisma.notification.findMany({
            where: { userID: id },
            orderBy: { createdAt: 'desc' },
        });
        return sendResponse({
        message: "Notifications fetched successfully",
        res,
        statusCode: 200,
        success: true,
        data: notifications,
      });
    } catch (error) {
        console.error("Error fetching notifications:", error);
         return sendResponse({statusCode:500,res,success:false,message:"Failed to fetch notifications",data:error.message});
    }
};

const markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;
    try {
        const updatedNotification = await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });
        return sendResponse({
        message: "Notification marked as read",
        res,
        statusCode: 200,
        success: true,
        data: updatedNotification,
      });
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return sendResponse({statusCode:500,res,success:false,message:"Failed to mark notification as read",data:error.message});
    }
}
export { getNotificationsByUserId, markNotificationAsRead };