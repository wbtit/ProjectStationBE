import { Router } from "express";
import {
  AddEmployee,
  GetEmployeeBYID,
  getAllEmployees,
  UpdateEmployee
} from "../../controllers/employee.js";
import Authenticate from "../../middlewares/authenticate.js";
import { isStaff } from "../../middlewares/isstaff.js";


//employee Stats
import { userStats } from "../../controllers/employeestats.js";

const router = Router();

router.post("/employee", Authenticate, isStaff, AddEmployee); // Adding employee

router.get("/employee", Authenticate, getAllEmployees); // Get all employee

router.get("/employee/:eid", Authenticate, isStaff, GetEmployeeBYID); // Get employee by id

router.patch("/employee/:id", Authenticate, isStaff, UpdateEmployee) // Editing employee details

router.get("/stats/:id",Authenticate,userStats)

export default router;