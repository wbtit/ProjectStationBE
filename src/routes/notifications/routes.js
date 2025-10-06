import { getNotificationsByUserId, markNotificationAsRead } from "../../controllers/notification.js";

import express from "express";
const router = express.Router();

router.get("/", getNotificationsByUserId);
router.patch("/read/:notificationId", markNotificationAsRead);

export { router as NotificationsRouter };