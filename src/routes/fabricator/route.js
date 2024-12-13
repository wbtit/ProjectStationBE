import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { isAdmin } from "../../middlewares/isadmin.js";
import {
  AddFabricator,
  AddBranch,
  DeleteFabricator,
  GetAllFabricator,
  UpdateFabricator,
} from "../../controllers/fabricator.js";

const router = Router({ mergeParams: true });

router.post("/addfabricator", Authenticate, isAdmin, AddFabricator);
router.post("/:fid/addbranch", Authenticate, isAdmin, AddBranch);
router.delete("/:id/deletefabricator", Authenticate, isAdmin, DeleteFabricator);
router.get("/getallfabricators", GetAllFabricator);
router.patch("/:id/updatefabricator", Authenticate, isAdmin, UpdateFabricator);

export default router;
