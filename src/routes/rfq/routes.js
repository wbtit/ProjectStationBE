import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { rfqUploads } from "../../config/multer.js";

import {
    addRFQ,
    sentRFQByUser,
    Inbox,
    RFQseen,
    RFQByID,
    RfqViewFiles
} from "../../controllers/rfq.js"

const router=Router()

router.post(
"/rfq/addrfq",Authenticate,rfqUploads.array("files"),
addRFQ
),

router.get("/rfq/:id/:fid",Authenticate,RfqViewFiles)

router.get("/rfq/sent",Authenticate,sentRFQByUser)
router.get("/rfq/inbox",Authenticate,Inbox),
router.patch("/rfq/:id/update",Authenticate,RFQseen)
router.get("/rfq/:id",Authenticate,RFQByID)

export default router