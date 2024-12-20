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

router.post("/fabricator", Authenticate, isAdmin, AddFabricator); // Adding Fabricator

router.post("/:fid/addbranch", Authenticate, isAdmin, AddBranch); // Adding Branch By Fabricator ID

router.delete("/:id/deletefabricator", Authenticate, isAdmin, DeleteFabricator); // Delete Fabricator By ID

router.get("/fabricator", GetAllFabricator); // Get All The Fabricator

router.patch("/:id/updatefabricator", Authenticate, isAdmin, UpdateFabricator); // Updating Fabricator By ID

export default router;
