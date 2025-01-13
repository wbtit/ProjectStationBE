import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { isAdmin } from "../../middlewares/isadmin.js";
import { AddDepartment, GetDepartment } from "../../controllers/department.js";

const router = Router();

router.post("/department", Authenticate, isAdmin, AddDepartment); // Adding Departments

router.get("/department", GetDepartment); // Get All Departments ( Not sure about middlewares )

export default router;
