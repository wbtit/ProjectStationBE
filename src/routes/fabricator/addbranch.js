import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { v4 as uuidv4 } from "uuid";
import Authenticate from "../../middlewares/authenticate.js";
import { isValidUUID } from "../../utils/isValiduuid.js";

const router = Router();

router.post("/:fid/add", Authenticate, async (req, res) => {
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

  if (!id) {
    return sendResponse({
      message: "User not found",
      res,
      statusCode: 404,
      success: false,
      data: null,
    });
  }

  if (!city || !state || !country || !zip_code || !address)
    return sendResponse({
      message: "Fields are empty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });

  if (is_superuser) {
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
    }
  } else {
    return sendResponse({
      message: "Only admin can add branch",
      res,
      statusCode,
      success: false,
      data: null,
    });
  }
});

export default router;
