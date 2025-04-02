import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { getWbsActivity, getAcivity } from "../../controllers/wbsactivity.js";

const router = Router();

router.get("/wbs/:type/:projectID", Authenticate, getWbsActivity);
router.get("/wbs", getAcivity);

export default router;
