import { sendResponse } from "../utils/responder.js";

// Middleware to allow access to Admin, Manager, and Project Manager
const ClientAccess = (req, res, next) => {
  const { is_superuser, is_sales, role } = req?.user || {};

  const isAllowed =
    (is_superuser && (role === "STAFF" || role === "CLIENT")) ||
    (is_sales && role === "STAFF");

  if (isAllowed) {
    return next();
  }

  return sendResponse({
    res,
    statusCode: 403,
    message: "Access Denied",
    success: false,
    data: null,
  });
};

export { ClientAccess };
