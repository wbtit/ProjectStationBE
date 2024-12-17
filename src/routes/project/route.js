import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { BroadAccess } from "../../middlewares/broadaccess.js";
import {
  AddProject,
  Uploadfiles,
  UpdateProject,
  GetAllProjects,
  GetProjectByID,
  GetAllFilesByProjectID,
  GetAllfiles,
  DownloadFile
} from "../../controllers/project.js";
import { uploads } from "../../config/multer.js"

const router = Router();

router.post("/projects", Authenticate, BroadAccess, AddProject); // Adding Projects

router.post(
  "/projects/:id/add_file",
  Authenticate,
  BroadAccess,
  uploads.array("files"),
  Uploadfiles
); // Upload Files To Project

router.get("/projects/project-files", Authenticate, BroadAccess, GetAllfiles);

router.patch("/projects/:id", Authenticate, BroadAccess, UpdateProject); // Update Projects

router.get("/projects", Authenticate, BroadAccess, GetAllProjects); // Get All Projects

router.get("/projects/:id", Authenticate, BroadAccess, GetProjectByID); // Get Project by ID


router.get(
  "/projects/:id/files",
  Authenticate,
  BroadAccess,
  GetAllFilesByProjectID
); // Get project files by project id

router.get(
  "/projects/:id/files/:fid",

  DownloadFile
); // Download specific file

export default router;
