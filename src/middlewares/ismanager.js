import { sendResponse } from "../utils/responder.js";

// Checking the user is a manager

const isManager = async (req, res, next) => {
  const { is_manager } = req?.user;

  if (!is_manager) { // If not a manager then return
    console.log("User is not a manager");
    return sendResponse({
      message: "You are not a manager",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }

  next(); // If manager pass the request
};

export { isManager };


