import { sendResponse } from "../utils/responder.js";

// To allow Admin, Manager and Project Manager

const BroadAccess = (req, res, next) => {
  const { is_superuser, is_manager,is_sales } = req?.user;

  if (!is_manager && !is_superuser && !is_sales) {  // If not a admin or a managers then return 
    return sendResponse({
      message: "Access Denied",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }

  next(); // If true then pass the request
};

export { BroadAccess };
