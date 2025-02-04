import { Router } from "express";
import { GetSubTasks } from "../../controllers/subtasks.js";
import Authenticate from "../../middlewares/authenticate.js";

const router = Router();

router.get("/st/:projectID/:wbsactivityID", Authenticate, GetSubTasks);

export { router as SubTasksRouter };
