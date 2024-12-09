import { Router } from "express";
import { getDepartments } from "../../models/getAllDepartments.js";
import { sendResponse } from "../../utils/responder.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const departments = await getDepartments();
    console.log("Department Fetched Successfully");
    return sendResponse({
      message: "Department fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: departments,
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
});

export default router;
