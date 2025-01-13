import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { submittalsUploads } from "../../config/multer.js";
import { AddSubmitals } from "../../controllers/subbmitals.js";

const router = Router();

router.post(
  "/submittals",
  Authenticate,
  submittalsUploads.array("files"),
  AddSubmitals
);

export { router as Submittals};
