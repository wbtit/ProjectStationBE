import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { sendResponse } from "../../utils/responder.js";

const router = Router();

router.post("/", Authenticate, async (req, res) => {
  if (!req.user) {
    return sendResponse({
      message: "User not Authenticated.",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  } else {
    return sendResponse({
      message: "User Fetched Successfully.",
      res,
      statusCode: 200,
      success: true,
      data: req.user,
    });
  }
});

export default router