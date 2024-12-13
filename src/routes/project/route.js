import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { BroadAccess } from "../../middlewares/broadaccess.js";
import { AddProject, Uploadfiles } from "../../controllers/project.js";
import uploads from "../../config/multer.js";

const router = Router();

router.post("/addproject", Authenticate, BroadAccess, AddProject);
router.post(
  "/:id/uploadprojectfiles",
  Authenticate,
  BroadAccess,
  uploads.array("files"),
  Uploadfiles
);

export default router;
