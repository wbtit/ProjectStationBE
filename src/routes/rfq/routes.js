import { Router } from "express";
import Authenticate from "../../middlewares/authenticate";
import { rfqUploads } from "../../config/multer";

import {
    addRFQ,
    sentRFQByUser,
    Inbox,
    RFQseen,
    RFQByID
} from "../../controllers/rfq.js"
import { RFIByID } from "../../controllers/rfi.js";

const router=Router()

router.post(
"/rfq/addrfq",Authenticate,rfqUploads.array("files"),
addRFQ
),
router.get("/rfq/sent",Authenticate,sentRFQByUser)
router.get("/rfq/inbox",Authenticate,Inbox),
router.patch("/rfq/:id/update",Authenticate,RFQseen)
router.get("/rfq/:id",Authenticate,RFIByID)

export default router