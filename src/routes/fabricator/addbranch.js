import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { v4 as uuidv4 } from "uuid";
import Authenticate from "../../middlewares/authenticate.js";
import { isValidUUID } from "../../utils/isValiduuid.js";
import { isAdmin } from "../../middlewares/isadmin.js";

const router = Router();

router.post("/:fid/add", Authenticate, isAdmin, async (req, res) => {
  const { fid } = req.params;
  console.log();

  if (!isValidUUID(fid)) {
    return sendResponse({
      message: "Invalid fabricator",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  const { city, state, country, zip_code, address } = req.body;

  const { id } = req.user;

  if (!city || !state || !country || !zip_code || !address)
    return sendResponse({
      message: "Fields are empty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });

  try {
    const fabricator = await prisma.fabricator.findUnique({
      where: {
        id: fid,
      },
    });

    if (!fabricator) {
      return sendResponse({
        message: "Invalid Fabricator",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const { branches } = fabricator;

    branches.push({
      id: uuidv4(),
      city,
      address,
      zip_code,
      state,
      country,
    });

    console.log(branches);

    const newbranches = await prisma.fabricator.update({
      where: {
        id: fid,
      },
      data: {
        branches,
      },
    });

    return sendResponse({
      message: "Branch Added Successfully",
      res,
      statusCode: 200,
      success: true,
      data: newbranches,
    });
  } catch (error) {
    return sendResponse({
      message: "Something went wrong",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  } finally {
    await prisma.$disconnect();
  }
});

export default router;
