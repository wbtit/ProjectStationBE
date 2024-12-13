import { Router } from "express";
import { sendResponse } from "../../utils/responder.js";
import Authenticate from "../../middlewares/authenticate.js";
import prisma from "../../lib/prisma.js";
import uploads from "../../config/multer.js";
import { v4 as uuidv4 } from "uuid";
import { isValidUUID } from "../../utils/isValiduuid.js";
import { BroadAccess } from "../../middlewares/broadaccess.js";

const router = Router();

// Route for adding project

router.post("/", Authenticate, BroadAccess, async (req, res) => {

  
});

//  Uplaod Files

router.post("/:id/files", BroadAccess, uploads.array("files"), async (req, res) => {
  
});

export default router;
