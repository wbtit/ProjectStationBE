import { sendResponse } from "../utils/responder.js";

// Check is the user is a sales

const isStaff = (req, res, next) => {
  const { is_staff,is_manager } = req?.user;

  if (!is_staff||!is_manager) {
    // If not in sales then return
    // console.log("You are not a staff");
    return sendResponse({
      message: "You are not a staff",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }

  next(); // If yes then pass the request
};

export { isStaff };
