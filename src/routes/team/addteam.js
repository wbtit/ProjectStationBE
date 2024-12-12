import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { sendResponse } from "../../utils/responder.js";
import { getUserByID } from "../../models/userUniModelByID.js";
import prisma from "../../lib/prisma.js";
import { BroadAccess } from "../../middlewares/broadaccess.js";

const router = Router();

router.post("/", Authenticate,BroadAccess, async (req, res) => {
  const { name, manager, teammembers } = req.body;

  if (!name || !manager || !teammembers) {
    console.log("Fields are empty!");
    return sendResponse({
      message: "Fields are empty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const isManager = await getUserByID({ id: manager });

    if (!isManager) {
      console.log("Invalid Manager");
      return sendResponse({
        message: "Invalid Manager",
        res,
        statusCode: 200,
        success: false,
        data: null,
      });
    }

    const { is_active, is_staff } = isManager;

    if (!is_active || !is_staff) {
      console.log("Person assigned for manager is not a manager");
      return sendResponse({
        message: "Person assigned is not a manager",
        res,
        statusCode: 200,
        success: false,
        data: null,
      });
    }

    const teams = await prisma.team.create({
      data: {
        name: name,
        managerID: manager,
        members: teammembers,
      },
    });

    return sendResponse({
      message: "Team Created Successfully!",
      res,
      statusCode: 200,
      success: true,
      data: teams,
    });
  } catch (error) {
    console.log(error.message);
    return sendResponse({
      message: "Something went wrong",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
});

export default router;
