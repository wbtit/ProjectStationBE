// Please navigate to very bottom of the file to know the logics in this file.

import { sendResponse } from "../utils/responder.js";
import { v4 as uuidv4 } from "uuid";
import prisma from "../lib/prisma.js";
import { isValidUUID } from "../utils/isValiduuid.js";
import path from "path";
import fs from "fs";
// import client from "../redis/index.js";
import mime from "mime";
import { fetchTeamDetails } from "../models/getTeamMemberDetails.js";

const AddProject = async (req, res) => {
  const {
    name,
    description,
    fabricator,
    department,
    team,
    manager,
    status,
    stage,
    tools,
    connectionDesign,
    miscDesign,
    customer,
    start_date,
    end_date,
    estimatedHours,
  } = req.body;

  console.log(req.body);

  if (
    !name ||
    !description ||
    !fabricator ||
    !department ||
    !team ||
    !manager ||
    !start_date ||
    !end_date ||
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
        estimatedHours: parseInt(estimatedHours),
        name: name,
        approvalDate: start_date,
        connectionDesign: connectionDesign,
        customerDesign: customer,
        departmentID: department,
        fabricatorID: fabricator,
        managerID: manager,
        miscDesign: miscDesign,
        stage: stage,
        startDate: start_date,
        teamID: team,
        status: status,
        tools: tools,
        endDate: end_date,
      },
    });

    // const projects = JSON.parse(await client.get("allprojects"));
    // projects.push(project);

    // await client.set("allprojects", JSON.stringify(projects));

    console.log(project);

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
      message: error.message,
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

    // Step 2: Get the cached projects from Redis
    // const cachedProjects = await client.get("allprojects");

    // Step 3: Parse the cached projects
    let projects = JSON.parse(cachedProjects);

    // Step 4: Find and update the files field in the cached project by ID
    const projectIndex = projects.findIndex((project) => project.id === id);
    if (projectIndex !== -1) {
      projects[projectIndex].files = updatedFilesProject.files; // Replace files
    }

    // Step 5: Set the updated projects back to Redis
    // await client.set("allprojects", JSON.stringify(projects));

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

  console.log(req.body);

  req.body = { ...req.body, fabricator: null };

  try {
    if (req.body.fabricator) {
      // Check whether the ID is a fabricator ID
      const fabricator = await prisma.fabricator.findUnique({
        where: {
          id: req.body.fabricator,
        },
      });
      // if (!fabricator) {
      //   return sendResponse({
      //     message: "Invalid Fabricator",
      //     res,
      //     statusCode: 400,
      //     success: false,
      //     data: null,
      //   });
      // }
    }

    if (req.body.department) {
      // Check whether such department exists
      const department = await prisma.department.findUnique({
        where: {
          id: req.department,
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

    if (req.body.team) {
      // Check whether such team exists
      const team = await prisma.team.findUnique({
        where: {
          id: req.body.team,
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

    if (req.body.manager) {
      // Check the provided user ID is a manager or not
      const { is_manager } = await prisma.users.findUnique({
        where: {
          id: req.manager,
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

    const updateData = {};
    const fieldsToUpdate = [
      "name",
      "fabricator",
      "description",
      "duration",
      "startDate",
      "endDate",
      "status",
      "stage",
      "manager",
      "approvalDate",
    ];

    fieldsToUpdate.forEach((field) => {
      if (
        req.body[field] !== null &&
        req.body[field] !== undefined &&
        req.body[field] !== ""
      ) {
        updateData[field] = req.body[field];
      }
    });

    console.log(updateData);

    const updatedProject = await prisma.project.update({
      where: {
        id: id,
      },
      data: updateData, // req.body must contains only fields present in the project schema
    });

    // // Step 2: Get the cached projects from Redis
    // const cachedProjects = await client.get("allprojects");

    // // Step 3: Parse the cached projects
    // let projects = JSON.parse(cachedProjects);

    // // Step 4: Find and update the project in the cached list
    // const projectIndex = projects.findIndex((project) => project.id === id);
    // if (projectIndex !== -1) {
    //   projects[projectIndex] = updatedProject; // Replace the old project with the updated one
    // }

    // // Step 5: Set the updated projects back to Redis
    // await client.set("allprojects", JSON.stringify(projects));

    return sendResponse({
      message: "Project Update Successfully",
      res,
      statusCode: 200,
      success: true,
      data: updatedProject,
    });
  } catch (error) {
    console.log(error);
    return sendResponse({
      message: error.message,
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
    // const project = await client.get("allprojects");
    console.log("I got hit");
    // if (project) {
    //   console.log("From Redis ");
    //   return sendResponse({
    //     message: "Projects retrived successfully",
    //     res,
    //     statusCode: 200,
    //     success: true,
    //     data: JSON.parse(project),
    //   });
    // }

    const projects = await prisma.project.findMany({
      include: {
        fabricator: true,
        manager: {
          select: {
            f_name: true,
            l_name: true,
          },
        },
        team: {
          select: {
            name: true,
            members: true,
          },
        },
        department: {
          select: {
            name: true,
            manager: {
              select: {
                f_name: true,
                l_name: true,
              },
            },
          },
        },
      },
    });

    // await client.set("allprojects", JSON.stringify(projects));

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
      message: error.message,
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
      include: {
        team: {
          include: {
            manager: true,
          },
        },
        department: true,
        fabricator: true,
        manager: true,
        tasks: true,
        accepttasks: true,
      },
    });

    const ids = project.team.members.map((mem) => mem.id);

    const data = await fetchTeamDetails({ ids });

    const Data = project.team.members.map((m) => {
      return { ...data[m.id], role: m.role };
    });

    return sendResponse({
      message: "Project Retrived Successfully",
      res,
      statusCode: 200,
      success: true,
      data: {
        ...project,
        team: {
          ...project.team,
          members: Data,
        },
      },
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

const ViewFile = async (req, res) => {
  const { id, fid } = req.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const fileObject = project.files.find((file) => file.id === fid);

    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

    const __dirname = path.resolve();
    const filePath = path.join(__dirname, fileObject.path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    const mimeType = mime.getType(filePath);
    res.setHeader("Content-Type", mimeType || "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${fileObject.originalName}"`
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("View File Error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong while viewing the file" });
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
  ViewFile,
};
