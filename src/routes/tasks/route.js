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
import {
  GetTaskByIDAssignes,
  addTaskAssignes,
  updateTaskAssignes,
} from "../../controllers/assignes.js";
import {
  addComment,
  getCommentById,
  updateCommentByID,
} from "../../controllers/comment.js";

const router = Router();

router.post("/tasks", Authenticate, BroadAccess, AddTask); // Adding Task

router.delete("/tasks/:id", Authenticate, BroadAccess, DeleteTask); // Deleteing Task

router.get("/tasks/:id", Authenticate, GetTaskByID); // Get Task By Task ID

router.get("/tasks", Authenticate, GetTask); // Get All Task

router.patch("/tasks/:id", Authenticate, BroadAccess, UpdateTaskByID); // Update Task By ID (METHOD PATCH)

router.put("/tasks/:id", Authenticate, BroadAccess, UpdateTaskByID); // Update Task By ID (METHOD PUT)

router.get("/tasks/:id/accept", Authenticate, TaskByIDAccept); // Accept Task Using ID

router.put("/tasks/:id/accept", Authenticate, UpdateTaskByIDs); // Update Accept Tasks By ID

router.post("/tasks/add_assignes", Authenticate, GetTaskByIDAssignes);
router.get("/tasks/:id/get_assignes", Authenticate, addTaskAssignes);
router.put("/tasks/:id/update_assignes", Authenticate, updateTaskAssignes);
router.post("/tasks/add_comment", Authenticate, addComment);
router.get("/tasks/:id/get_comment", Authenticate, getCommentById);
router.put("/tasks/:id/update_comment", Authenticate, updateCommentByID);

export default router;
