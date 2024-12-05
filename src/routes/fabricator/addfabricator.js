import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";

const router = Router();

router.post("/", Authenticate, async (req, res) => {
  console.log(req.body);

  if (!req.user) {
    return sendResponse({
      message: "User not Authenticated.",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }

  const { id, is_superuser } = req.user;

  const { name, headquater, website, drive } = req.body;

  if (!id) {
    console.log("User Not Founs");
    return sendResponse({
      message: "User not found",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

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
  if (is_superuser) {
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
  } else {
    return sendResponse({
      message: "Only superuser can add fabricator.",
      res,
      statusCode: 404,
      success: false,
      data: null,
    });
  }
});

export default router;
