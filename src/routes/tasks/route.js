import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { BroadAccess } from "../../middlewares/broadaccess.js";
import { isAdmin } from "../../middlewares/isadmin.js";
import { isManager } from "../../middlewares/ismanager.js";
import { isProjectManager } from "../../middlewares/isprojectmanager.js";
import { isSales } from "../../middlewares/issales.js";


import {
  AddTask,
  DeleteTask,
  GetTask,
  GetTaskByID,
  UpdateTaskByID,
  calender,
  getMyTaskByIdAndStatus,
  getAllTasksByUserId,
  getMyTaskRecords
} from "../../controllers/task.js";

import { TaskByIDAccept, UpdateTaskByIDs } from "../../controllers/accept.js";

import {
  GetTaskByIDAssignes,
  addTaskAssignes,
  updateTaskAssignes,
} from "../../controllers/assignes.js";

import { addComment,acknowledge } from "../../controllers/comment.js";

import {
  addAssignedList,
  getAssignedListById,
  getAssignedList,
  updateAssignedList,
  deleteAssignedList,
} from "../../controllers/assignedList.js";
import {
  getConfirmtaskById,
  postConfirmtaskById,
  putConfirmtaskById,
  patchConfirmtaskById,
  deleteConfirmtaskById,
} from "../../controllers/confirm.js";

const router = Router();

router.post("/tasks", Authenticate, BroadAccess, AddTask); // Adding Task

router.delete("/tasks/:id", Authenticate, BroadAccess, DeleteTask); // Deleteing Task



router.get("/tasks", Authenticate,GetTask); // Get All Task

router.patch("/tasks/:id", Authenticate, BroadAccess, UpdateTaskByID); // Update Task By ID (METHOD PATCH)

router.put("/tasks/:id", Authenticate, BroadAccess, UpdateTaskByID); // Update Task By ID (METHOD PUT)

router.get("/tasks/:id/accept", Authenticate, TaskByIDAccept); // Accept Task Using ID

router.put("/tasks/:id/accept", Authenticate, UpdateTaskByIDs); // Update Accept Tasks By ID

router.post("/tasks/:task_id/add_assignes", Authenticate, addTaskAssignes); //add assignes

router.get("/tasks/:id/get_assignes", Authenticate, GetTaskByIDAssignes); //get assignes

router.put("/tasks/:id/update_assignes", Authenticate, updateTaskAssignes); //update assignes


//comments
router.post("/tasks/add_comment/:task_id", Authenticate, addComment); //add comment
router.patch("/tasks/acknowledge/:commentId",Authenticate,acknowledge)//acknowledge



//CRUD Assigned list

router.post("/add_assigned-list", Authenticate, addAssignedList); // add assigned-list

router.get("/get_assigned-list", Authenticate, getAssignedList); // get assigned-list

router.get("/get_assigned-list/:id", Authenticate, getAssignedListById); // get assigned-list

router.put("/update_assigned-list/:id", Authenticate, updateAssignedList); // update assigned-list

router.patch("/update_assigned-list/:aid", Authenticate, updateAssignedList); // patchUpdate assigned-list

router.delete("/delete_assigned-list/:id", Authenticate, deleteAssignedList); //delete assigned-list






// CRUD confirm assign list
router.post("/assigned-list/:id/confirm", Authenticate, postConfirmtaskById);

router.get("/assigned-list/:id/confirm", Authenticate, getConfirmtaskById);

router.put("/assigned-list/:id/confirm", Authenticate, putConfirmtaskById);

router.patch("/assigned-list/:id/confirm", Authenticate, patchConfirmtaskById);

router.delete(
  "/assigned-list/:id/confirm",
  Authenticate,
  deleteConfirmtaskById
);

router.get("/tasks/:id/:date/calender", Authenticate, calender);

router.get("/tasks/my_tasks", Authenticate, getMyTaskByIdAndStatus); // Fetching usres non ended tasks

router.get("/task/all_my_tasks", Authenticate, getAllTasksByUserId); // Fetching Users all tasks

router.get("/tasks/my_task_records", Authenticate, getMyTaskRecords); // Fetching Users all tasks

router.get("/tasks/:id", Authenticate, GetTaskByID); // Get Task By Task ID

export default router;