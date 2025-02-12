import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { rfiUploads } from "../../config/multer.js";

import {
  addRFI,
  sentRFIByUser,
  Inbox,
  RFIseen,
  RFIByID
} from "../../controllers/rfi.js";

const router = Router();

router.post(
  "/rfi/addrfi",
  Authenticate,
  rfiUploads.array("files"),
  addRFI
);
router.get("/rfi/sent", Authenticate, sentRFIByUser);
router.get("/rfi/inbox", Authenticate, Inbox);
router.patch("/rfi/:id/update", Authenticate, RFIseen);
router.get("/rfi/:id", Authenticate, RFIByID);

export default router;