import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { BroadAccess } from "../../middlewares/broadaccess.js";
import { isStaff } from "../../middlewares/isstaff.js";
import { isProjectManager } from "../../middlewares/isprojectmanager.js";
import {
  AddProject,
  Uploadfiles,
  UpdateProject,
  GetAllProjects,
  GetProjectByID,
  GetAllFilesByProjectID,
  GetAllfiles,
  DownloadFile,
  ViewFile,
  getProjectsByUser,
} from "../../controllers/project.js";
import { uploads } from "../../config/multer.js";
import { isStaffAndClient } from "../../middlewares/isstaffandclient.js";

const router = Router();

router.post("/projects", Authenticate, BroadAccess, AddProject); // Adding Projects

router.post(
  "/projects/:id/add_file",
  Authenticate,
  BroadAccess,
  uploads.array("files"),
  Uploadfiles
); // Upload Files To Project+

router.get("/projects/project-files", Authenticate, isStaff, GetAllfiles);

router.patch("/projects/:id", Authenticate, BroadAccess, UpdateProject); // Update Projects

router.get("/projects", Authenticate  , GetAllProjects); // Get All Projects

router.get("/projects/:id", Authenticate, isStaff, GetProjectByID); // Get Project by ID

router.get(
  "/projects/:id/files",
  Authenticate,
  isStaff,
  GetAllFilesByProjectID
); // Get project files by project id

router.get(
  "/projects/:id/files/:fid",

  DownloadFile
); // Download specific file

router.get("/projects/viewfile/:id/:fid", ViewFile);

router.get("/projects/u/user", Authenticate, isStaffAndClient, getProjectsByUser);

export default router;
