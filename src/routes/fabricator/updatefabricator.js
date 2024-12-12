import { Router } from "express";
import prisma from "../../lib/prisma.js";
import Authenticate from "../../middlewares/authenticate.js";
import { sendResponse } from "../../utils/responder.js";
import { isAdmin } from "../../middlewares/isadmin.js";

const router = Router();

router.patch("/:id", Authenticate, isAdmin, async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  const { role } = user;

  const updateData = req.body;

  // Checking whether the user is Staff
  if (role === "STAFF") {
    try {
      const updatedFabricator = await prisma.fabricator.update({
        where: { id: id },
        data: updateData,
      });
      return sendResponse({
        message: "Successfully updated the fabricator data.",
        res,
        statusCode: 200,
        success: true,
        data: updatedFabricator,
      });
    } catch (error) {
      console.error(error);
      return sendResponse({
        message: "Failed to update the fabricator.",
        res,
        statusCode: 500,
        success: false,
        data: null,
      });
    } finally {
      prisma.$disconnect();
    }
  } else {
    return sendResponse({ message: "Only staff admin can upate fabricator." });
  }
});

export default router;
