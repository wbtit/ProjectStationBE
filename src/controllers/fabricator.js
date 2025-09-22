// Please navigate to very bottom of the file to know the logics in this file.

import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { v4 as uuidv4 } from "uuid";
import { isValidUUID } from "../utils/isValiduuid.js";
import { getFabricators } from "../models/getAllFabricator.js";
import path from "path";
import fs from "fs";
// import client from "../redis/index.js";
import mime from "mime";

const AddFabricator = async (req, res) => {
  const { id } = req.user;

  const { name, headquater, website, drive } = req.body;

  if (!name || !headquater) {
    return sendResponse({
      message: "Fields are emmpty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  // Checking the user is a super user.

  try {
    const fabricator = await prisma.fabricator.create({
      data: {
        createdById: id,
        fabName: name,
        headquaters: { ...headquater, id: uuidv4() },
        drive: drive ? drive : " ",
        website: website ? website : "",
      },
    });

    return sendResponse({
      message: "Fabricator Added Successfully.",
      res,
      statusCode: 200,
      success: true,
      data: fabricator,
    });
  } catch (error) {
    // console.log(error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  } finally {
    prisma.$disconnect();
  }
};

const AddBranch = async (req, res) => {
  const { fid } = req.params;

  // console.log(req.body);

  if (!isValidUUID(fid)) {
    return sendResponse({
      message: "Invalid fabricator",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  const { city, state, country, zip_code, address } = req.body.branch;

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
};

const DeleteFabricator = async (req, res) => {
  const { id } = req.params;

  const user = req.user;

  const { role } = user;

  // Checking Whether the user is a STAFF
  if (role === "STAFF") {
    try {
      const deletedFabricator = await prisma.fabricator.delete({
        where: {
          id: id,
        },
      });
      return sendResponse({
        message: "Successfully deleted the fabricator data.",
        res,
        statusCode: 200,
        success: true,
        data: deletedFabricator,
      });
    } catch (error) {
      return sendResponse({
        message: "Failed to delete fabricator.",
        res,
        statusCode: 500,
        success: false,
        data: null,
      });
    } finally {
      prisma.$disconnect();
    }
  } else {
    return sendResponse({
      message: "Only staff admin can delete fabricator.",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }
};

const GetAllFabricator = async (req, res) => {
  const { id } = req.user || {};

  if (!id) {
    return sendResponse({
      message: "Unauthorized request. User not found.",
      res,
      statusCode: 401,
      success: false,
      data: null,
    });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        is_superuser: true,
        is_manager: true,
        is_staff: true, // still selected if needed elsewhere
        is_sales: true,
        is_oe: true,
        is_pmo: true,
        is_est: true,
        is_supermanager:true
      },
    });
    // console.log("-=--=-=-=-=-=-=-",user)

    if (!user) {
      return sendResponse({
        message: "User not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    const hasAllowedRole =
      // user.is_superuser ||
      user.is_manager ||
      user.is_sales ||
      user.is_oe ||
      user.is_pmo ||
      user.is_est;

    let fabricators;
    if(user.is_superuser|| user.is_supermanager){
      fabricators= await prisma.fabricator.findMany({
        include:{
          project:true
        }
      });
    }
    else if (hasAllowedRole) {
      fabricators = await getFabricators(id);
    } else {
      fabricators = await prisma.fabricator.findMany({
        where: { createdById: id },
        include: {
          userss: true,
          project:true
        },
      });
    }

    return sendResponse({
      message: "Fetched all fabricators",
      res,
      statusCode: 200,
      success: true,
      data: fabricators,
    });

  } catch (error) {
    console.error("Error fetching fabricators:", error);
    return sendResponse({
      message: "Something went wrong.",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};



const UpdateFabricator = async (req, res) => {
  const { id } = req.params;

  const user = req.user;

  const { role } = user;

  const updateData = req.body;

  // Checking whether the user is Staff
  if (role === "STAFF") {
    try {
      const updatedFabricator = await prisma.fabricator.update({
        where: { id: id },
        data: updateData,
      });
      return sendResponse({
        message: "Successfully updated the fabricator data.",
        res,
        statusCode: 200,
        success: true,
        data: updatedFabricator,
      });
    } catch (error) {
      // console.log(error.message);
      return sendResponse({
        message: error.message,
        res,
        statusCode: 500,
        success: false,
        data: null,
      });
    } finally {
      prisma.$disconnect();
    }
  } else {
    return sendResponse({
      message: "Only staff admin can upate fabricator.",
      res,
      statusCode: 403,
      success: false,
      data: null,
    });
  }
};

const Uploadfiles = async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return sendResponse({
      message: "Invalid Fabrictor",
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
      path: `/public/fabricatortemp/${file.filename}`, // Relative path
    }));

    // Fetch the project
    const fab = await prisma.fabricator.findUnique({
      where: { id },
    });

    if (!fab) {
      return sendResponse({
        message: "Invalid Fabricator ID",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    // Merge existing files with the new file details
    const updatedFiles = [...(fab.files || []), ...fileDetails];

    // Update the project with new files array
    const updatedFilesFabricator = await prisma.fabricator.update({
      where: { id },
      data: {
        files: updatedFiles,
      },
    });

    // Step 2: Get the cached projects from Redis
    // const cachedProjects = await client.get("allprojects");

    // Step 3: Parse the cached projects
    // let projects = JSON.parse(cachedProjects);

    // Step 4: Find and update the files field in the cached project by ID
    // const projectIndex = project.findIndex((projects) => projects.id === id);
    // if (projectIndex !== -1) {
    //   project[projectIndex].files = updatedFilesProject.files; // Replace files
    // }

    // Step 5: Set the updated projects back to Redis
    // await client.set("allprojects", JSON.stringify(projects));

    return sendResponse({
      message: "Files Upload Complete",
      res,
      statusCode: 200,
      success: true,
      data: updatedFilesFabricator,
    });
  } catch (error) {
    console.error("Error uploading files:", error);
    return sendResponse({
      message: error?.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const GetFabricatorByID = async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return sendResponse({
      message: "Invalid Fabricator ID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const fabricator = await prisma.fabricator.findUnique({
      where: {
        id,
      },include:{
        file:true,
        project:true
      }
    });

    // console.log(fabricator);

    if (!fabricator) {
      return sendResponse({
        message: "Fabricator not found",
        res,
        statusCode: 400,
        success: true,
        data: null,
      });
    }

    return sendResponse({
      message: "Fabricator fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: fabricator,
    });
  } catch (error) {
    // console.log(error.message);
    return sendResponse({
      message: "Something went wrong",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const DeleteBranch = async (req, res) => {
  const { fid, bid } = req.params;

  if (!isValidUUID(fid) || !isValidUUID(bid)) {
    return sendResponse({
      message: "Invalid Ids",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  const fabricator = await prisma.fabricator.findUnique({
    where: {
      id: fid,
    },
  });

  if (!fabricator) {
    return sendResponse({
      message: "Cannot find fabricator",
      res,
      statusCode: 409,
      success: false,
      data: null,
    });
  }

  const branches = fabricator.branches;

  if (branches.length === 0) {
    return sendResponse({
      message: "Branches are empty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  const newBranches = branches.filter((item) => item.id != bid);

  const newFabricator = await prisma.fabricator.update({
    where: {
      id: fid,
    },
    data: {
      branches: newBranches,
    },
  });

  return sendResponse({
    message: "Branch Deletion Success",
    res,
    statusCode: 200,
    success: true,
    data: newFabricator,
  });
};

const DownloadFile = async (req, res) => {
  const { id, fid } = req.params; // id: Project ID, fid: File UUID

  try {
    // Fetch project to access the files array
    const fab = await prisma.fabricator.findUnique({
      where: { id },
    });

    if (!fab) {
      return res.status(404).json({ message: "Fabricator not found" });
    }

    // Find the file in the project's files array using the file UUID (fid)
    const fileObject = fab.files.find((file) => file.id === fid);

    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

    // Construct the file path using __dirname
    const __dirname = path.resolve(); // Get the absolute path of the current directory
    const filePath = path.join(__dirname, fileObject.path);

    // console.log("Firnam", __dirname);

    // console.log("File path:", filePath);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // console.log("FO", fileObject);

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
    const project = await prisma.fabricator.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({ message: "Fabricator not found" });
    }

    const fileObject = project.files.find((file) => file.id === fid);

    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

    const __dirname = path.resolve();
    const filePath = path.join(__dirname, fileObject.path);

    // console.log(filePath);

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
  AddBranch,

  AddFabricator,
  DeleteFabricator,
  GetAllFabricator,
  UpdateFabricator,
  GetFabricatorByID,
  
  DeleteBranch,
  Uploadfiles,
  DownloadFile,
  ViewFile,
};
