import { Router } from "express";
import Authenticate from "../../middlewares/authenticate.js";
import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { isValidUUID } from "../../utils/isValiduuid.js"

const router = Router();

router.patch("/:id", Authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.user) {
      console.log("User not authenticated");
      return sendResponse({
        message: "User not authenticated",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }
    console.log("id:",id)

    if(!id) {
        return sendResponse({
            message : "Invalid task ID",
            res ,
            statusCode : 400,
            success : false,
            data : null
        })
    }
    console.log(isValidUUID(id), typeof id)

    if(!isValidUUID(id))  {
        return sendResponse({
            message : "Invalid task UUid",
            res ,
            statusCode : 400,
            success : false,
            data : null
        })
    } 

    

    // Ensure the request body is not empty
    if (!Object.keys(req.body).length) {
      return sendResponse({
        message: "No data provided for update",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    // Update only the fields provided in req.body
    const task = await prisma.task.update({
      where: {
        id, // Ensure `id` is an integer
      },
      data: req.body, // Only update provided fields
    });

    if (!task) {
      console.log("Error in updating task by ID");
      return sendResponse({
        message: "Error in updating task by ID",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    return sendResponse({
      message: "Task updated successfully",
      res,
      statusCode: 200,
      success: true,
      data: task,
    });
  } catch (error) {
    console.error("Error in updating task", error.message);
    return sendResponse({
      message: "Error in updating task",
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
