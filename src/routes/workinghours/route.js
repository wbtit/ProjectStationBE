import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import {
  Start,
  End,
  Pause,
  Resume,
  getWork,
} from "../../controllers/workinghours.js";

const router = Router();

router.post("/wh/start", Authenticate, Start);
router.patch("/wh/pause", Authenticate, Pause);
router.patch("/wh/resume", Authenticate, Resume);
router.patch("/wh/end", Authenticate, End);
router.get("/wh", Authenticate, getWork);

export default router;
