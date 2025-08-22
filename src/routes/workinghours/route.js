import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import {
  Start,
  End,
  Pause,
  Resume,
  getWork,
  getReWorkDuration,
  updateWorkingHours
  
} from "../../controllers/workinghours.js";

const router = Router();

router.post("/wh/start", Authenticate, Start);
router.patch("/wh/pause", Authenticate, Pause);
router.patch("/wh/resume", Authenticate, Resume);
router.patch("/wh/end", Authenticate, End);
router.get("/wh/:task_id", Authenticate, getWork);
router.patch("/working-hours/:id",Authenticate,updateWorkingHours)


router.patch("/rework",Authenticate,getReWorkDuration)


export default router;
