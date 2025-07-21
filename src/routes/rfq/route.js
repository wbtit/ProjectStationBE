import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { rfqUploads,rfqResponseUploads } from "../../config/multer.js";

import {
    addRFQ,
    sentRFQByUser,
    Inbox,
    RFQClosed,
    RFQByID,
    RfqViewFiles,
    addRfqResponse,
    getRfqResponseById,
    RfqresponseViewFiles,
    updateRfq
} from "../../controllers/rfq.js"

const router=Router()

router.post(
"/rfq/addrfq",Authenticate,rfqUploads.array("files"),
addRFQ
),

router.get("/rfq/:id/:fid",RfqViewFiles)
router.put("/rfq/update/:id",Authenticate,updateRfq)

router.get("/rfqResponse/:id/:fid",RfqresponseViewFiles)

router.get("/rfq/sent",Authenticate,sentRFQByUser)
router.get("/rfq/inbox",Authenticate,Inbox),
//route updated
router.patch("/rfq/close/:id/",Authenticate,RFQClosed)
router.get("/rfq/:id",Authenticate,RFQByID)


router.post("/addresponse/:rfqId",
    Authenticate,
    rfqResponseUploads.any("files"),
    addRfqResponse
  )
  router.get("/getResponse/:id",Authenticate,getRfqResponseById)

export default router