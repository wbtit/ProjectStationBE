import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { submittalsUploads } from "../../config/multer.js";
import {
  AddSubmitals,
  RecievedSubmittals,
  SentSubmittals,
  SubmittalsSeen,
} from "../../controllers/subbmitals.js";

const router = Router();

router.post(
  "/submittals",
  Authenticate,
  submittalsUploads.array("files"),
  AddSubmitals
);

router.get("/submittals/sent", Authenticate, SentSubmittals);

router.get("/submittals/recieved", Authenticate, RecievedSubmittals);

router.patch("/submittals/:id", Authenticate, SubmittalsSeen);

export { router as Submittals };
