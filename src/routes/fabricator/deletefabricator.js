import { Router } from "express";
import prisma from "../../lib/prisma.js";
import Authenticate from "../../middlewares/authenticate.js";
import { sendResponse } from "../../utils/responder.js";
import { isAdmin } from "../../middlewares/isadmin.js";

const router = Router();

router.delete("/:id", Authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const { role } = user;

  // Checking Whether the user is a STAFF
  if (role === "STAFF") {
    try {
      const deletedFabricator = await prisma.fabricator.delete({
        where: {
          id: id,
        },
      });
      return sendResponse({
        message: "Successfully deleted the fabricator data.",
        res,
        statusCode: 200,
        success: true,
        data: deletedFabricator,
      });
    } catch (error) {
      console.error(error);
      return sendResponse({
        message: "Failed to delete fabricator.",
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
      message: "Only staff admin can delete fabricator.",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }
});

export default router;
