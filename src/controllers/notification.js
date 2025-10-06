import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const getNotificationsByUserId = async (req, res) => {
    const { id } = req.user;
    try {
        const notifications = await prisma.notification.findMany({
            where: { userId: id },
            orderBy: { createdAt: 'desc' },
        });
        return sendResponse(res, 200, true, notifications, null, "Notifications fetched successfully");
    } catch (error) {
        return sendResponse(res, 500, false, null, error.message, "Failed to fetch notifications");
    }
};

const markNotificationAsRead = async (req, res) => {
    const { notificationId } = req.params;
    try {
        const updatedNotification = await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });
        return sendResponse(res, 200, true, updatedNotification, null, "Notification marked as read");
    } catch (error) {
        return sendResponse(res, 500, false, null, error.message, "Failed to mark notification as read");
    }
}
export { getNotificationsByUserId, markNotificationAsRead };