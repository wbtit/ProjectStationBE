import { Router } from "express";
import { AddEmployee } from "../../controllers/employee.js";
import Authenticate from "../../middlewares/authenticate.js";
import { isAdmin } from "../../middlewares/isadmin.js";

const router = Router();

router.post("/employe", Authenticate, isAdmin, AddEmployee);

export default router;
