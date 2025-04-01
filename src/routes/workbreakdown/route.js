import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import {
  addJobStudy,
  getJobStudy,
  putJobStudy,
} from "../../controllers/jobStudy.js";

const router = Router();

router.post("/addJobStudy", Authenticate, addJobStudy);


router.get("/getJobStudy/:id", Authenticate, getJobStudy);

router.patch("/putJobStudy/:id", Authenticate, putJobStudy);

export { router as WorkBreakDown };
