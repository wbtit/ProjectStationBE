import { Router } from "express";
import { sendResponse } from "../../utils/responder.js";
import Authenticate from "../../middlewares/authenticate.js";
import prisma from "../../lib/prisma.js";
import uploads from "../../config/multer.js";
import { v4 as uuidv4 } from "uuid";
import { isValidUUID } from "../../utils/isValiduuid.js";

const router = Router();

// Route for adding project

router.post("/", Authenticate, async (req, res) => {
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

  const { is_superuser } = req.user;

  if (!is_superuser) {
    console.log("Only Admin can add project");
    return sendResponse({
      message: "Only admin can add project",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }

  const {
    name,
    description,
    fabricatorID,
    departmentID,
    teamID,
    managerID,
    status,
    stage,
    tools,
    connectionDesign,
    miscDesign,
    customerDesign,
    startDate,
    appprovalDate,
    estimatedHours,
  } = req.body;

  if (
    !name ||
    !description ||
    !fabricatorID ||
    !departmentID ||
    !teamID ||
    !managerID ||
    !startDate ||
    !estimatedHours
  ) {
    console.log("Fields are empty");
    return sendResponse({
      message: "Fields are empty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const project = await prisma.project.create({
      data: {
        description: description,
        estimatedHours: estimatedHours,
        name: name,
        approvalDate: appprovalDate,
        connectionDesign: connectionDesign,
        customerDesign: customerDesign,
        departmentID: departmentID,
        fabricatorID: fabricatorID,
        managerID: managerID,
        miscDesign: miscDesign,
        stage: stage,
        startDate: startDate,
        teamID: teamID,
        status: status,
        tools: tools,
      },
    });

    return sendResponse({
      message: "Project created successfully",
      res,
      statusCode: 200,
      success: true,
      data: project,
    });
  } catch (error) {
    console.log(error.message);
    return sendResponse({
      message: "Somethings went wrong!!",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
});

//  Uplaod Files

router.post("/:id/files", uploads.array("files"), async (req, res) => {
  const { id } = req.params;

  console.log(id);

  if (!isValidUUID(id)) {
    console.log("Invalid UUID");
    return sendResponse({
      message: "Invalid Project",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    // Check if files are provided
    if (!req.files || req.files.length === 0) {
      console.log("No Files Are Uploaded.");

      return sendResponse({
        message: "No files uploaded",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    // Collect file paths
    const filePaths = req.files.map(
      (file) => `/public/projecttemp/${file.filename}`
    );

    console.log(filePaths);

    const project = await prisma.project.findUnique({
      where: {
        id: id,
      },
    });

    if (!project) {
      console.log("Invalid Project ID");
      return sendResponse({
        message: "Invalid Project ID",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    let { files } = project;

    console.log(typeof files);

    filePaths.map((fileloc) => {
      files.push({
        id: uuidv4(),
        filepath: fileloc,
      });
    });

    const updatedFilesProject = await prisma.project.update({
      where: {
        id: id,
      },
      data: {
        files: filePaths,
      },
    });

    console.log("File Upload Complete");

    return sendResponse({
      message: "Files Upload Complete",
      res,
      statusCode: 200,
      success: true,
      data: updatedFilesProject,
    });
  } catch (error) {
    console.error(error.message);

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
