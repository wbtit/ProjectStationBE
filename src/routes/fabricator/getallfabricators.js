import { Router } from "express";
import { getFabricators } from "../../models/getAllFabricator.js";
import { sendResponse } from "../../utils/responder.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const fabricators = await getFabricators();
    return sendResponse({
      message: "Fetched all fabricators",
      res,
      statusCode: 200,
      success: true,
      data: fabricators,
    });
  } catch (error) {
    return sendResponse({
      message: "Soemthing went wrong.",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
});

export default router
