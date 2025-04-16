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
  Uploadfiles,
  DownloadFile,
  ViewFile,
} from "../../controllers/fabricator.js";
import { fabricatorsUploads } from "../../config/multer.js";

const router = Router({ mergeParams: true });

router.post("/fabricator", Authenticate, isAdmin, AddFabricator); // Adding Fabricator

router.post(
  "/fabricator/:id/add_file",
  Authenticate,
  fabricatorsUploads.array("files"),
  Uploadfiles
); // Upload Files To Project+

router.post("/fabricator/:fid/addbranch", Authenticate, isAdmin, AddBranch); // Adding Branch By Fabricator ID

router.delete("/fabricator/:id", Authenticate, isAdmin, DeleteFabricator); // Delete Fabricator By ID

router.get("/fabricator",Authenticate, GetAllFabricator); // Get All The Fabricator

router.patch(
  "/fabricator/:id/updatefabricator",
  Authenticate,
  UpdateFabricator
); // Updating Fabricator By ID

router.get("/fabricator/:id", Authenticate, isAdmin, GetFabricatorByID); // Get fabricator by ID

router.delete(
  "/fabricator/:fid/deletebranch/:bid",
  Authenticate,
  isAdmin,
  DeleteBranch
);

router.get(
  "/fabricator/:id/files/:fid",

  DownloadFile
); // Download specific file

router.get("/fabricator/viewfile/:id/:fid", ViewFile);

export default router;
