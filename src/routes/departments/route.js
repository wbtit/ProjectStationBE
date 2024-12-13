import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { isAdmin } from "../../middlewares/isadmin.js";
import { AddDepartment, GetDepartment } from "../../controllers/department.js";

const router = Router();

router.post("/adddepartment", Authenticate, isAdmin, AddDepartment);
router.get("/getdepartment", GetDepartment); // Not sure about middlewares

export default router;
