import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { BroadAccess } from "../../middlewares/broadaccess.js";
import {
  AddTask,
  DeleteTask,
  GetTask,
  GetTaskByID,
  UpdateTaskByID,
} from "../../controllers/task.js";
import { TaskByIDAccept, UpdateTaskByIDs } from "../../controllers/accept.js";

const router = Router();

router.post("/tasks", Authenticate, BroadAccess, AddTask);
router.delete("/tasks/:id", Authenticate, BroadAccess, DeleteTask);
router.get("/tasks/:id", Authenticate, GetTaskByID);
router.get("/tasks", Authenticate, GetTask);
router.patch("/tasks/:id", Authenticate, BroadAccess, UpdateTaskByID);
router.put("/tasks/:id", Authenticate, BroadAccess, UpdateTaskByID);
router.get("/tasks/:id/accept", Authenticate, TaskByIDAccept);
router.put("/tasks/:id/accept", Authenticate, UpdateTaskByIDs);

export default router;
