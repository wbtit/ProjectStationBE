import { Router } from "express";
import { GetSubTasks, UpdateSubTasks,addSubTasks } from "../../controllers/subtasks.js";
import Authenticate from "../../middlewares/authenticate.js";

const router = Router();

router.post("/add/:projectID/:wbsactivityID",Authenticate,addSubTasks)
router.get("/:projectID/:wbsactivityID", Authenticate, GetSubTasks);
router.patch("/:subtaskid", Authenticate, UpdateSubTasks);

export { router as SubTasksRouter };
