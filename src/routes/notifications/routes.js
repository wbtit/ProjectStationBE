import { getNotificationsByUserId, markNotificationAsRead } from "../../controllers/notification.js";
import Authenticate from "../../middlewares/authenticate.js";
import express from "express";
const router = express.Router();

router.get("/", Authenticate, getNotificationsByUserId);
router.patch("/read/:notificationId", Authenticate, markNotificationAsRead);

export { router as NotificationsRouter };