import { sendResponse } from "../utils/responder.js";

// To allow Admin, Manager and Project Manager

const ClientAccess = (req, res, next) => {
  const { is_superuser, role } = req?.user;

  if (
    (is_superuser && role === "STAFF") ||
    (is_superuser && role === "CLIENT")
  ) {
    next(); // If true then pass the request
  } else {
    // If not a admin or a managers then return
    return sendResponse({
      message: "Access Denied",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }
};

export { ClientAccess };
