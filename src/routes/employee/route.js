import { Router } from "express";
import {
  AddEmployee,
  GetEmployeeBYID,
  getAllEmployees,
} from "../../controllers/employee.js";
import Authenticate from "../../middlewares/authenticate.js";
import { isAdmin } from "../../middlewares/isadmin.js";

const router = Router();

router.post("/employee", Authenticate, isAdmin, AddEmployee); // Adding employee

router.get("/employee", Authenticate, isAdmin, getAllEmployees); // Get all employee

router.get("/employee/:eid", Authenticate, isAdmin, GetEmployeeBYID); // Get employee by id

export default router;
