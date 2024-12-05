import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { sendResponse } from "../../utils/responder.js";
import prisma from "../../lib/prisma.js";
import { hashPassword } from "../../utils/crypter.js";

const router = Router();

router.post("/:cid", Authenticate, async (req, res) => {
  const { cid } = req.params;

  if (!cid) {
    return sendResponse({
      message: "Invalid Client",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  if (!req.body) {
    return sendResponse({
      message: "Fields are empty!",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  if (!req.user) {
    return sendResponse({
      message: "User not authenticated.",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }

  const { is_superuser, role } = req.user;

  if (!is_superuser) {
    return sendResponse({
      message: "Only admin can added clients.",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }

  try {
    const updateclient = await prisma.client.update({
      where: {
        id: cid,
      },
      data: req.body,
    });

    return sendResponse({
      message: "Client Updated Successfully.",
      res,
      statusCode: 200,
      success: true,
      data: updateclient,
    });
  } catch (error) {
    console.log(error.message);
    sendResponse({
      message: "Something went wrong!!",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  } finally {
    prisma.$disconnect();
  }
});

export default router;
