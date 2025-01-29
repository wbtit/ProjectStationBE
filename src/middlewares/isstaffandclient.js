import { sendResponse } from "../utils/responder.js";

// Check is the user is a sales

const isStaffAndClient = (req, res, next) => {
  const { is_staff, role } = req?.user;

  if (!is_staff || role !== "CLIENT" || role !== "STAFF") {
    // If not in sales then return
    console.log("You are not a staff or client");
    return sendResponse({
      message: "You are not a staff or client",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }

  next(); // If yes then pass the request
};

export { isStaffAndClient };
