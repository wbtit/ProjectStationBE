import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { rfiUploads,rfiResponseUploads } from "../../config/multer.js";

import {
  addRFI,
  sentRFIByUser,
  Inbox,
  RFIseen,
  RFIByID,
  viewRFIfiles,
  viewRFIResponsefiles,
  addRFIResponse,
  getRfiresponse,
  getRfiByProjectId 
} from "../../controllers/rfi.js";

const router = Router();

router.post(
  "/rfi/addrfi",
  Authenticate,  
  rfiUploads.array("files"),
  addRFI
);

router.get("/rfi/viewfile/:id/:fid", viewRFIfiles);//view files in RFI
router.get("/rfi/response/viewfile/:id/:fid",viewRFIResponsefiles);//view files in RFIResponse

router.get("/rfi/sent", Authenticate, sentRFIByUser);

router.get("/:projectId",Authenticate,getRfiByProjectId)

router.get("/rfi/inbox", Authenticate, Inbox);
router.patch("/rfi/:id/update", Authenticate, RFIseen);
router.get("/rfi/:id", Authenticate, RFIByID);

router.post("/rfi/addResponse/:rfiId",
  Authenticate,
  rfiResponseUploads.any("files"),
  addRFIResponse
)
router.get("/rfi/getResponse/:id",Authenticate,getRfiresponse)

export default router;