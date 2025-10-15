import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { decompression } from "../utils/Zstd.js";

const getNotificationsByUserId = async (req, res) => {
  const { id } = req.user;

  try {
    const notifications = await prisma.notification.findMany({
      where: { userID: id, read: false },
      orderBy: { createdAt: 'desc' },
    });

    // Decompress payload for each notification
    const processedNotifications = notifications.map((n) => ({
      ...n,
      payload: decompression(n.payload),
    }));

    return sendResponse({
      message: "Notifications fetched successfully",
      statusCode: 200,
      success: true,
      data: processedNotifications,
      res, // HTTP response object, assuming your sendResponse needs it
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return sendResponse({
      statusCode: 500,
      success: false,
      message: "Failed to fetch notifications",
      data: error.message,
      res,
    });
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