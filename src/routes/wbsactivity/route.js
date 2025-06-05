import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { getWbsActivity, getAcivity,getWbsActivityByStage,getTotalHours } from "../../controllers/wbsactivity.js";

const router = Router();

router.get("/wbs/:type/:projectId/:stage", Authenticate, getWbsActivity);
router.get("/wbs/totalHours/:type/:projectId/:stage",Authenticate,getTotalHours)
router.get("/wbs/:projectID",Authenticate,getWbsActivityByStage)
router.get("/wbs", getAcivity);

export default router;
