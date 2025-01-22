import { Router } from "express";
import {getNotifications,markAsRead,deleteNotifications} from "../../controllers/notification.js"

const router= Router()

router.get("/:userID",getNotifications)
router.patch("/:notificationID",markAsRead)
router.delete("/:notificationID",deleteNotifications)
export default router