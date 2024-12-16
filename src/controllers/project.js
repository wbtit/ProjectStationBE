
// Please navigate to very bottom of the file to know the logics in this file.


import { sendResponse } from "../utils/responder.js";
import { v4 as uuidv4 } from "uuid";
import prisma from "../lib/prisma.js";
import { isValidUUID } from "../utils/isValiduuid.js";

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

    // Collect file paths
    const filePaths = req.files.map(
      (file) => `/public/projecttemp/${file.filename}`
    );

    const project = await prisma.project.findUnique({
      where: {
        id: id,
      },
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

    let { files } = project;

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

    return sendResponse({
      message: "Files Upload Complete",
      res,
      statusCode: 200,
      success: true,
      data: updatedFilesProject,
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

export { AddProject, Uploadfiles };
