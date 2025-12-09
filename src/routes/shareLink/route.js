import express from "express";
import { Router } from "express";

import { createShareLink,downloadShare } from "../../controllers/shareLink.js";

const router = Router();
//share
router.post("/:table/:parentId/:fileId", createShareLink);


router.get("/:token", downloadShare);

export { router as ShareLink };