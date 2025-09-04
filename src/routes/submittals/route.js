import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { submittalsUploads,SubmittalsResponseUploads } from "../../config/multer.js";
import {
  AddSubmitals,
  RecievedSubmittals,
  SentSubmittals,
  SubmittalsSeen,
  submitalsViewFiles,
  addSubmittalsResponse,
  getSubmittalresponse,
  submitalsResponseViewFiles,
  getSubmittal,
  getSubmittalsByProjectId,
  updateSubmittal
} from "../../controllers/subbmitals.js";

const router = Router();

router.post(
  "/submittals",
  Authenticate,
  submittalsUploads.array("files"),
  AddSubmitals
);

router.get("/submittals/:id/:fid",Authenticate,submitalsViewFiles)
router.get("/submittalsResponse/:id/:fid",Authenticate,submitalsResponseViewFiles)

router.get("/getSubmittals/:submittalId",Authenticate,getSubmittal)

router.get("/submittals/sent", Authenticate, SentSubmittals);

router.get("/:projectId",Authenticate,getSubmittalsByProjectId)

router.get("/submittals/recieved", Authenticate, RecievedSubmittals);

router.put("/submittalsStatus/:id", Authenticate, SubmittalsSeen);
router.put("/update/:id",Authenticate,updateSubmittal);

router.post("/addresponse/:submittalId",
  Authenticate,
  SubmittalsResponseUploads.any("files"),
  addSubmittalsResponse
)

router.get("/getResponse/:id",Authenticate,getSubmittalresponse)

export { router as Submittals };
