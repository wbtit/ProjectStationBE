import jwt from "jsonwebtoken";
import { sendResponse } from "../utils/responder.js";

const Authenticate = async (req, res, next) => {
  //   const authHeaders = req?.headers?.authorization;
  console.log(req.headers);
  const authHeaders =
    req.body?.headers?.Authorization || req?.headers?.authorization;
  console.log(authHeaders);

  const secret = process.env.SECRET;
  if (!secret) {
    console.log("Secret key is not defined");
    return sendResponse({
      message: "Secret key is defined",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }

  if (authHeaders) {
    const token = authHeaders.split(" ")[1];

    try {
      // Using async/await for verify
      const payload = jwt.verify(token, secret);
      req.user = payload; // Assigning decoded payload (setting user deatils in the req) to req.user
      next();
    } catch (err) {
      return sendResponse({
        message: "Invalid token",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }
  } else {
    return sendResponse({
      message: "Token is not provided",
      res,
      statusCode: 401,
      success: false,
      data: null,
    });
  }
};

export default Authenticate;
