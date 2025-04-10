import { sendResponse } from "../utils/responder.js";

// To check the user is a project manager

const isProjectManager = (req, res, next) => {
  const { is_staff, is_manager } = req?.user;

  if (!is_staff || !is_manager) { // If not a project manager then return
    // console.log("You are not a project manager");
    return sendResponse({
      message: "You are not a project manager",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }
  next(); // If project manager then pass the request
};

export { isProjectManager };
