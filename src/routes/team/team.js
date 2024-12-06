import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { areUsers } from "../../models/areUsers.js";
import { isValidUUID } from "../../utils/isValiduuid.js";

const router = Router();

router.get("/:tid", async (req, res) => {
  const { tid } = req.params;

  console.log(tid);

  if (!tid) {
    console.log("Team ID not found");
    return sendResponse({
      message: "Team ID not found",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  if (!isValidUUID(tid)) {
    console.log("Invalid Team ID");
    return sendResponse({
      message: "Invalid Team UUID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const teams = await prisma.team.findUnique({
      where: {
        id: tid,
      },
    });

    if (!teams) {
      console.log("Invalid Team ID");
      return sendResponse({
        message: "Invalid team ID",
        res,
        statusCode: 200,
        success: false,
        data: null,
      });
    }

    const { foundUsers, missingUsers } = await areUsers({
      users: teams.members,
    });

    const newTeams = { ...teams, members: foundUsers };

    console.log(foundUsers);
    console.log(teams);

    return sendResponse({
      message: "Team Data fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: { data: newTeams, missingUsers },
    });
  } catch (error) {
    console.log(error.message);
    return sendResponse({
      message: "Somethings went wrong",
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
