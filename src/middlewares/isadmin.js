import { sendResponse } from "../utils/responder.js";

// To verify the user is a admin

const isAdmin = (req, res, next) => {
  const { is_superuser } = req?.user;

  if (!is_superuser) { // If not a admin return
    console.log("You are not a admin");
    return sendResponse({
      message: "You are not a admin",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }

  next(); // If admin pass the request
};

export { isAdmin };
