import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { getWbsActivity } from "../../controllers/wbsactivity.js";

const router = Router();

router.get("/wbs/:type", Authenticate, getWbsActivity);

export default router