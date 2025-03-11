import { Router } from "express";
import { GetSubTasks, UpdateSubTasks } from "../../controllers/subtasks.js";
import Authenticate from "../../middlewares/authenticate.js";

const router = Router();

router.get("/st/:projectID/:wbsactivityID", Authenticate, GetSubTasks);
router.patch("/st/:subtaskid", Authenticate, UpdateSubTasks);

export { router as SubTasksRouter };
