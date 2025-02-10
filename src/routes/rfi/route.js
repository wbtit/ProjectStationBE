import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { rfiUploads } from "../../config/multer.js";

import {
  addRFI,
  sentRFIByUser,
  Inbox,
  RFIseen,
} from "../../controllers/rfi.js";

const router = Router();

router.post(
  "/rfi/addrfi",
  Authenticate,
  (req, res, next) => {
    console.log("Hey This is the end, hold your breath and count to ten",req.files);
    next();
  },
  rfiUploads.array("files"),
  addRFI
);
router.get("/rfi/sent", Authenticate, sentRFIByUser);
router.get("/rfi/inbox", Authenticate, Inbox);
router.patch("/rfi/:id/update", Authenticate, RFIseen);

export default router;