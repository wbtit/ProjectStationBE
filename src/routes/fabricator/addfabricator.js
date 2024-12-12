import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { isAdmin } from "../../middlewares/isadmin.js";

const router = Router();

router.post("/", Authenticate, isAdmin, async (req, res) => {
  const { id } = req.user;

  const { name, headquater, website, drive } = req.body;

  if (!name || !headquater || !website || !drive) {
    console.log("Invalid Field");
    return sendResponse({
      message: "Fields are emmpty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  // Checking the user is a super user.
  try {
    const fabricator = await prisma.fabricator.create({
      data: {
        createdById: id,
        fabName: name,
        headquaters: headquater,
        drive: drive,
        website: website,
      },
    });

    return sendResponse({
      message: "Fabricator Added Successfully.",
      res,
      statusCode: 200,
      success: true,
      data: fabricator,
    });
  } catch (error) {
    console.error(error);
    return sendResponse({
      message: "Sorry something went wrong.",
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
