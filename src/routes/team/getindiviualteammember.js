import { Router } from "express";
import { sendResponse } from "../../utils/responder.js";
import Authenticate from "../../middlewares/authenticate.js";
import { BroadAccess } from "../../middlewares/broadaccess.js";
import prisma from "../../lib/prisma.js";
import { getUserByID } from "../../models/userUniModelByID.js";

const router = Router({ mergeParams: true });

const isMember = ({ members, id }) => {
  console.log(members, id);

  for (let member of members) {
    if (member.id === id) {
      return true; // Exit early if member is found
    }
  }

  return false; // Return false if no member was found
};


router.post("/", Authenticate, BroadAccess, async (req, res) => {
  const { teamid, id } = req.params;

  try {
    const team = await prisma.team.findUnique({
      where: {
        id: teamid,
      },
    });

    if (!team) {
      return sendResponse({
        message: "Cannot find the team",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    console.log("Checker", isMember({ id: id, members: team.members }));

    if (isMember({ id: id, members: team.members })) {
      const user = await getUserByID({ id: id });
      if (!user) {
        return sendResponse({
          message: "Cannot fetch user",
          res,
          statusCode: 400,
          success: false,
          data: null,
        });
      }
      return sendResponse({
        message: "Member fetched successfully",
        res,
        statusCode: 200,
        success: true,
        data: user,
      });
    } else {
      return sendResponse({
        message: "Member is not in this team",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
  } catch (error) {
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
