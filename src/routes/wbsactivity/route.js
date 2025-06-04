import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { getWbsActivity, getAcivity,getWbsActivityByStage } from "../../controllers/wbsactivity.js";

const router = Router();

router.get("/wbs/:type/:projectId/:stage", Authenticate, getWbsActivity);
router.get("/wbs/:projectID",Authenticate,getWbsActivityByStage)
router.get("/wbs", getAcivity);

export default router;
