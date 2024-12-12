import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import { BroadAccess } from "../../middlewares/broadaccess.js";
import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { areUsers } from "../../models/areUsers.js";

const router = Router({ mergeParams: true });

router.post("/", Authenticate, BroadAccess, async (req, res) => {
  const { id } = req.params;

  console.log(id);

  try {
    const team = await prisma.team.findUnique({
      where: {
        id,
      },
    });

    console.log(team);

    if (!team) {
      console.log("Team not found");
      return sendResponse({
        message: "Team not found",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    let members = team.members;
    const { foundUsers, missingUsers } = await areUsers({ users: members });

    console.log(foundUsers, missingUsers);

    return sendResponse({
      message: "Team members fetche successfully",
      res,
      statusCode: 200,
      success: true,
      data: foundUsers,
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
  } finally {
    prisma.$disconnect();
  }
});

export default router;
