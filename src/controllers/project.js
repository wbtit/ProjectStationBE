// Please navigate to very bottom of the file to know the logics in this file.

import { sendResponse } from "../utils/responder.js";
import { v4 as uuidv4 } from "uuid";
import prisma from "../lib/prisma.js";
import { isValidUUID } from "../utils/isValiduuid.js";
import path from "path";
import fs from "fs";

const AddProject = async (req, res) => {
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

  console.log(req.body);

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
    console.log(project)

    return sendResponse({
      message: "Project created successfully",
      res,
      statusCode: 200,
      success: true,
      data: project,
    });
  } catch (error) {
    return sendResponse({
      message: "Somethings went wrong!!",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const Uploadfiles = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  if (!isValidUUID(id)) {
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
      return sendResponse({
        message: "No files uploaded",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    // Extract file details (uuid, originalName, path)
    const fileDetails = req.files.map((file) => ({
      filename: file.filename, // UUID + extension
      originalName: file.originalname, // Original name of the file
      id: file.filename.split(".")[0], // Extract UUID from the filename
      path: `/public/projecttemp/${file.filename}`, // Relative path
    }));

    // Fetch the project
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return sendResponse({
        message: "Invalid Project ID",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    // Merge existing files with the new file details
    const updatedFiles = [...(project.files || []), ...fileDetails];

    // Update the project with new files array
    const updatedFilesProject = await prisma.project.update({
      where: { id },
      data: {
        files: updatedFiles,
      },
    });

    return sendResponse({
      message: "Files Upload Complete",
      res,
      statusCode: 200,
      success: true,
      data: updatedFilesProject,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return sendResponse({
      message: "Something went wrong",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const UpdateProject = async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return sendResponse({
      message: "Invalid IDs",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    if (req.body.fabricatorID) {
      // Check whether the ID is a fabricator ID
      const fabricator = await prisma.fabricator.findUnique({
        where: {
          id: req.body.fabricatorID,
        },
      });
      console.log("Gbrica=", fabricator);
      if (!fabricator) {
        return sendResponse({
          message: "Invalid Fabricator",
          res,
          statusCode: 400,
          success: false,
          data: null,
        });
      }
    }

    if (req.body.departmentID) {
      // Check whether such department exists
      const department = await prisma.department.findUnique({
        where: {
          id: req.departmentID,
        },
      });
      if (!department) {
        return sendResponse({
          message: "Invalid Department",
          res,
          statusCode: 400,
          success: false,
          data: null,
        });
      }
    }

    if (req.body.teamID) {
      // Check whether such team exists
      const team = await prisma.team.findUnique({
        where: {
          id: req.teamID,
        },
      });
      if (!team) {
        return sendResponse({
          message: "Invalid Team",
          res,
          statusCode: 400,
          success: 400,
          data: null,
        });
      }
    }

    if (req.body.managerID) {
      // Check the provided user ID is a manager or not
      const { is_manager } = await prisma.users.findUnique({
        where: {
          id: req.managerID,
        },
        select: {
          is_manager: true,
        },
      });

      if (!is_manager)
        return sendResponse({
          message: "Invalid Manager or The user is not a manager",
          res,
          statusCode: 400,
          success: false,
          data: null,
        });
    }

    const updatedProject = await prisma.project.update({
      where: {
        id: id,
      },
      data: req.body, // req.body must contains only fields present in the project schema
    });

    return sendResponse({
      message: "Project Update Successfully",
      res,
      statusCode: 200,
      success: true,
      data: updatedProject,
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
    await prisma.$disconnect();
  }
};

const GetAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany();

    return sendResponse({
      message: "Projects retrived successfully",
      res,
      statusCode: 200,
      success: true,
      data: projects,
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
};

const GetProjectByID = async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return sendResponse({
      message: "Invalid ID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const project = await prisma.project.findUnique({
      where: {
        id,
      },
    });
    return sendResponse({
      message: "Project Retrived Successfully",
      res,
      statusCode: 200,
      success: true,
      data: project,
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
};

const GetAllfiles = async (req, res) => {
  try {
    const files = await prisma.project.findMany({
      select: {
        files: true,
      },
    });

    return sendResponse({
      message: "Fetched All Files",
      res,
      statusCode: 200,
      success: 200,
      data: files,
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
};

const GetAllFilesByProjectID = async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return sendResponse({
      message: "Invalid ID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const { files } = await prisma.project.findUnique({
      where: {
        id,
      },
      select: {
        files: true,
      },
    });

    return sendResponse({
      message: "Fetched files successfully",
      res,
      statusCode: 200,
      success: true,
      data: files,
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
};

const DownloadFile = async (req, res) => {
  const { id, fid } = req.params; // id: Project ID, fid: File UUID

  try {
    // Fetch project to access the files array
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Find the file in the project's files array using the file UUID (fid)
    const fileObject = project.files.find((file) => file.id === fid);

    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

    // Construct the file path using __dirname
    const __dirname = path.resolve(); // Get the absolute path of the current directory
    const filePath = path.join(__dirname, fileObject.path);

    console.log("Firnam", __dirname);

    console.log("File path:", filePath);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    console.log("FO", fileObject);

    // Initiate file download
    res.download(filePath, fileObject.originalName, (err) => {
      if (err) {
        console.error("File Download Error:", err);
        return res
          .status(500)
          .json({ message: "Error occurred while downloading the file" });
      }
    });
  } catch (error) {
    console.error("Download File Error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong while downloading the file" });
  }
};

export {
  AddProject,
  Uploadfiles,
  UpdateProject,
  GetAllProjects,
  GetProjectByID,
  GetAllFilesByProjectID,
  GetAllfiles,
  DownloadFile,
};
