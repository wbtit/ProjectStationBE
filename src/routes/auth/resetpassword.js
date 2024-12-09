import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { sendResponse } from "../../utils/responder.js";
import { comparePassword } from "../../utils/crypter.js";
import { hashPassword } from "../../utils/crypter.js";
import prisma from "../../lib/prisma.js";
import { generateToken } from "../../utils/jwtutils.js";

const router = Router();

router.put("/", Authenticate, async (req, res) => {
  if (!req.user) {
    console.log("User Not Authenticated.");
    return sendResponse({
      message: "User not authenticated.",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }

  const { old_password, new_password } = req.body;

  const { username, password, id } = req.user;

  console.log(await comparePassword(old_password, password));

  if (await comparePassword(old_password, password)) {
    const newPassword = await hashPassword(new_password);
    console.log("New Passowrd", newPassword);

    const updatedUser = await prisma.users.update({
      where: {
        id: id,
      },
      data: {
        is_firstLogin: false,
        password: newPassword,
      },
    });

    console.log("Password resetted successfully.");

    const token = generateToken(updatedUser);

    return sendResponse({
      message: "Password resetted successfully.",
      res,
      statusCode: 200,
      success: true,
      data: token,
    });
  } else {
    console.log("Password doesn't match.");
    return sendResponse({
      message: "Old Password is wrong",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }
});

export default router;
