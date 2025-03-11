import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { isAdmin } from "../../middlewares/isadmin.js";
import { AddDepartment, GetDepartment ,updateDepartment} from "../../controllers/department.js";

const router = Router();

router.post("/department", Authenticate, isAdmin, AddDepartment); // Adding Departments

router.get("/department", Authenticate,GetDepartment); // Get All Departments ( Not sure about middlewares )

router.patch("/department/:id",Authenticate,updateDepartment)// edit Department

export default router;
