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
import { GetTaskByIDAssignedList,addTaskAssignedList,updateTaskAssignesById } from "../../controllers/assignedList.js";

const router = Router();

router.post("/tasks", Authenticate, BroadAccess, AddTask);
router.delete("/tasks/:id", Authenticate, BroadAccess, DeleteTask);
router.get("/tasks/:id", Authenticate, GetTaskByID);
router.get("/tasks", Authenticate, GetTask);
router.patch("/tasks/:id", Authenticate, BroadAccess, UpdateTaskByID);
router.put("/tasks/:id", Authenticate, BroadAccess, UpdateTaskByID);
router.get("/tasks/:id/accept", Authenticate, TaskByIDAccept);
router.put("/tasks/:id/accept", Authenticate, UpdateTaskByIDs);
router.post('/tasks/add_assignes',Authenticate,addTaskAssignedList)
router.get('/tasks/:id/get_assignes',Authenticate,GetTaskByIDAssignedList)
router.put('/tasks/:id/update_assignes',Authenticate,updateTaskAssignesById)

export default router;
