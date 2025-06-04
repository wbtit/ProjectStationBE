import { Router } from "express";
import { GetSubTasks, UpdateSubTasks,addSubTasks,addSubTask } from "../../controllers/subtasks.js";
import Authenticate from "../../middlewares/authenticate.js";

const router = Router();

//upsert route handler
router.post("/add/:projectID/:wbsactivityID",Authenticate,addSubTasks)

//to add a single suntask
router.post("/oneSubtask/:projectID/:wbsactivityID",Authenticate,addSubTask)
router.get("/:projectID/:wbsactivityID/:stage", Authenticate, GetSubTasks);
router.patch("/:subtaskid", Authenticate, UpdateSubTasks);

export { router as SubTasksRouter };
