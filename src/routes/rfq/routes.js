import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { rfqUploads,rfqResponseUploads } from "../../config/multer.js";

import {
    addRFQ,
    sentRFQByUser,
    Inbox,
    RFQseen,
    RFQByID,
    RfqViewFiles,
    addRfqResponse,
    getRfqResponse
} from "../../controllers/rfq.js"

const router=Router()

router.post(
"/rfq/addrfq",Authenticate,rfqUploads.array("files"),
addRFQ
),

router.get("/rfq/:id/:fid",RfqViewFiles)

router.get("/rfq/sent",Authenticate,sentRFQByUser)
router.get("/rfq/inbox",Authenticate,Inbox),
router.patch("/rfq/:id/update",Authenticate,RFQseen)
router.get("/rfq/:id",Authenticate,RFQByID)



router.post("/addresponse/:rfqId",
    Authenticate,
    rfqResponseUploads.any("files"),
    addRfqResponse
  )
  router.get("/getResponse/:id",Authenticate,getRfqResponse)

export default router