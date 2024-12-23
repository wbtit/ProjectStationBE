// Please navigate to very bottom of the file to know the logics in this file.

import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { v4 as uuidv4 } from "uuid";
import { isValidUUID } from "../utils/isValiduuid.js";
import { getFabricators } from "../models/getAllFabricator.js";

const AddFabricator = async (req, res) => {
  const { id } = req.user;

  const { name, headquater, website, drive } = req.body;

  if (!name || !headquater || !website || !drive) {
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
        headquaters: headquater,
        drive: drive,
        website: website,
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
    return sendResponse({
      message: "Sorry something went wrong.",
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
  try {
    const fabricators = await getFabricators();
    return sendResponse({
      message: "Fetched all fabricators",
      res,
      statusCode: 200,
      success: true,
      data: fabricators,
    });
  } catch (error) {
    return sendResponse({
      message: "Soemthing went wrong.",
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
      return sendResponse({
        message: "Failed to update the fabricator.",
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
      },
    });

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

const DeleteBranch = async (req, res) => {
  const { fid, bid } = req.params;

  // const fabricator = await prisma.fabricator.findUnique({
  //   where: {
  //     id: fid,
  //   },
  // });

  // fabricator.branches = [];

  const newFabricator = await prisma.fabricator.update({
    where: {
      id: fid
    }, 
    data: {
      branches : []
    }
  })

  return sendResponse({
    message: "Branch Deletion Success",
    res,
    statusCode: 200,
    success: true,
    data: newFabricator
  });
};

export {
  AddBranch,
  AddFabricator,
  DeleteFabricator,
  GetAllFabricator,
  UpdateFabricator,
  GetFabricatorByID,
  DeleteBranch
};
