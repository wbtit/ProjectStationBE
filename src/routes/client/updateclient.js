import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { sendResponse } from "../../utils/responder.js";
import prisma from "../../lib/prisma.js";
import { isAdmin } from "../../middlewares/isadmin.js";

const router = Router();

router.post("/:cid", Authenticate, isAdmin, async (req, res) => {
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
