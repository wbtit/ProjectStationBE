import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { decompression } from "../utils/Zstd.js";

const getNotificationsByUserId = async (req, res) => {
  const { id } = req.user;

  try {
    const notifications = await prisma.notification.findMany({
      where: { userID: id, read: false },
      orderBy: { createdAt: "desc" },
    });

    const processedNotifications = await Promise.all(
      notifications.map(async (notif) => {
        let payload = notif.payload;

        // If payload contains compressed content, decompress it
        if (payload?.contentCompressed) {
          try {
            const buffer = Buffer.from(payload.contentCompressed, "base64");
            const decompressedText = await decompression(buffer);

            // Replace compressed data with readable content
            payload = {
              ...payload,
              content: decompressedText,
            };

            delete payload.contentCompressed;
          } catch (err) {
            console.error("Error decompressing notification:", err);
          }
        }

        return { ...notif, payload };
      })
    );
    console.log("The processes notification",processedNotifications)
    return sendResponse({
      message: "Notifications fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: processedNotifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return sendResponse({
      statusCode: 500,
      res,
      success: false,
      message: "Failed to fetch notifications",
      data: error.message,
    });
  }
};

export default getNotificationsByUserId;



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