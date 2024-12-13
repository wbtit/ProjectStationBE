import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { v4 as uuidv4 } from "uuid";
import Authenticate from "../../middlewares/authenticate.js";
import { isValidUUID } from "../../utils/isValiduuid.js";
import { isAdmin } from "../../middlewares/isadmin.js";

const router = Router();

router.post("/:fid/add", Authenticate, isAdmin, async (req, res) => {
  
});

export default router;
