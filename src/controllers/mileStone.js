import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const createMileStone = async (req, res) => {
  try {
    const { projectId, fabricatorId } = req.params;
    const { subject, description, status,stage, approvalDate,percentage } = req.body;

    if (!projectId || !fabricatorId || !subject || !description) {
      return sendResponse({
        message: "Required fields are missing",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const mileStone = await prisma.mileStone.create({
      data: {
        project_id: projectId,
        fabricator_id: fabricatorId,
        subject,
        stage:stage,
        description,
        status,
        percentage,
        approvalDate: approvalDate ? new Date(approvalDate) : undefined,
      },
    });

    return sendResponse({
      message: "Milestone created successfully",
      res,
      statusCode: 200,
      success: true,
      data: mileStone,
    });
  } catch (error) {
    console.error('Create MileStone Error:', error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};
const getMileStoneById = async (req, res) => {
  try {
    const { id } = req.params;

    const mileStone = await prisma.mileStone.findUnique({
      where: { id },
      include: {
        mileStoneSubmittals: true,
        Tasks: true,
        fabricator: true,
        project: true,
      },
    });

    if (!mileStone) {
      return sendResponse({
        message: "Milestone not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    return sendResponse({
      message: "Milestone fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: mileStone,
    });
  } catch (error) {
    console.error('Get MileStone Error:', error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};
const updateMileStone = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, description, status, approvalDate ,percentage} = req.body;

    const updatedMileStone = await prisma.mileStone.update({
      where: { id },
      data: {
        subject,
        description,
        status,
        percentage,
        approvalDate: approvalDate ? new Date(approvalDate) : undefined,
      },
    });

    return sendResponse({
      message: "Milestone updated successfully",
      res,
      statusCode: 200,
      success: true,
      data: updatedMileStone,
    });
  } catch (error) {
    console.error('Update MileStone Error:', error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};
const deleteMileStone = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.mileStone.delete({
      where: { id },
    });

    return sendResponse({
      message: "Milestone deleted successfully",
      res,
      statusCode: 200,
      success: true,
      data: null,
    });
  } catch (error) {
    console.error('Delete MileStone Error:', error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};
const getMileStonesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const mileStones = await prisma.mileStone.findMany({
      where: { project_id: projectId },
      include: {
        Tasks: true,
        mileStoneSubmittals: true,
        fabricator: true,
      },
      orderBy: { date: 'desc' }
    });

    return sendResponse({
      message: "Milestones fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: mileStones,
    });
  } catch (error) {
    console.error('Get MileStones Error:', error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};
const getAllMileStones = async (req, res) => {
  try {
    const mileStones = await prisma.mileStone.findMany({
      include: {
        Tasks: true,
        mileStoneSubmittals: true,
        fabricator: true,
        project: true,
      },
      orderBy: { date: 'desc' }
    });

    return sendResponse({
      message: "All Milestones fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: mileStones,
    });
  } catch (error) {
    console.error('Get All MileStones Error:', error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};
export {
  createMileStone,
  getMileStoneById,
  updateMileStone,
  deleteMileStone,
  getMileStonesByProject,
    getAllMileStones
};
