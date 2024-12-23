import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { isAdmin } from "../../middlewares/isadmin.js";
import {
  AddFabricator,
  AddBranch,
  DeleteFabricator,
  GetAllFabricator,
  UpdateFabricator,
  GetFabricatorByID,
  DeleteBranch,
} from "../../controllers/fabricator.js";

const router = Router({ mergeParams: true });

router.post("/fabricator", Authenticate, isAdmin, AddFabricator); // Adding Fabricator

router.post("/fabricator/:fid/addbranch", Authenticate, isAdmin, AddBranch); // Adding Branch By Fabricator ID

router.delete("/fabricator/:id", Authenticate, isAdmin, DeleteFabricator); // Delete Fabricator By ID

router.get("/fabricator", GetAllFabricator); // Get All The Fabricator

router.patch("/fabricator/:id/updatefabricator", Authenticate, isAdmin, UpdateFabricator); // Updating Fabricator By ID

router.get("/fabricator/:id", Authenticate, isAdmin, GetFabricatorByID); // Get fabricator by ID

router.delete(
  "/fabricator/:fid/deletebranch/:bid",
  Authenticate,
  isAdmin,
  DeleteBranch
);

export default router;
