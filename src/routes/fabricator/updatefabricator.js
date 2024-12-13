import { Router } from "express";
import prisma from "../../lib/prisma.js";
import Authenticate from "../../middlewares/authenticate.js";
import { sendResponse } from "../../utils/responder.js";
import { isAdmin } from "../../middlewares/isadmin.js";

const router = Router();

router.patch("/:id", Authenticate, isAdmin, async (req, res) => {
  
});

export default router;
