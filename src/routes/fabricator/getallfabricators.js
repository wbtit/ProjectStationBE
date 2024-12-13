import { Router } from "express";
import { getFabricators } from "../../models/getAllFabricator.js";
import { sendResponse } from "../../utils/responder.js";

const router = Router();

router.get("/", async (req, res) => {
  
});

export default router
