import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import {
  addJobStudy,
  getJobStudy,
  putJobStudy,
} from "../../controllers/jobStudy.js";
import {
  addSubTasks,
  getSubTasks,
  putSubTasksput,
} from "../../controllers/subTasks.js";

import {addTaskBreakDown,getTaskBreakDown,putTaskBreakDown} from '../../controllers/taskBreakDown.js'

const router =Router

router.post("/addJobStudy", Authenticate, addJobStudy);
router.post("/addTaskBreakDown", Authenticate, addTaskBreakDown);
router.post("/addSubTasks", Authenticate, addSubTasks);

router.get("/getTaskBreakDown", Authenticate, getTaskBreakDown);
router.get("/getSubTasks", Authenticate, getSubTasks);
router.get("/getJobStudy", Authenticate, getJobStudy);

router.put("/putJobStudy/:id", Authenticate, putJobStudy);
router.put("/putTaskBreakDown/:id", Authenticate, putTaskBreakDown);
router.put("/putSubTasks/:id", Authenticate, putSubTasksput);


export default router
