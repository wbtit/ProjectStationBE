import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { isAdmin } from "../../middlewares/isadmin.js";

const router = Router();

router.post("/", Authenticate, isAdmin, async (req, res) => {
  
});

export default router;
