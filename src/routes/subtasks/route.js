import { Router } from "express";
import { GetSubTasks, UpdateSubTasks,addSubTasks } from "../../controllers/subtasks.js";
import Authenticate from "../../middlewares/authenticate.js";

const router = Router();

router.post("/st/add/:projectID/:wbsactivityID",Authenticate,addSubTasks)
router.get("/st/:projectID/:wbsactivityID", Authenticate, GetSubTasks);
router.patch("/st/:subtaskid", Authenticate, UpdateSubTasks);

export { router as SubTasksRouter };
