import { sendResponse } from "../utils/responder.js";

// Check is the user is a sales 

const isSales = (req, res, next) => {
  const { is_sales } = req?.user;

  if (!is_sales) { // If not in sales then return
    console.log("You are not a sales person");
    return sendResponse({
      message: "You are not a sales person",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }

  next(); // If yes then pass the request
};

export { isSales}