import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import createEstimationLineItem from "../utils/createEstimationLineItems.js";

// CREATE a LineItemGroup
const createLineItemGroup = async (req, res) => {
  try {
    const { estimationId } = req.params;
    const { name, description, lineItems } = req.body;

    if (!name || !estimationId) {
      return sendResponse({
        message: "Name or estimationId missing",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const group = await prisma.estimationLineItemGroup.create({
      data: {
        name,
        description,
        estimationId,
        lineItems: {
          create: lineItems || [],
        },
      },
      include: {
        lineItems: true,
      },
    });

    if(group.id){
        createEstimationLineItem(group.id)
    }

    return sendResponse({
      message: "LineItemGroup created successfully",
      res,
      statusCode: 200,
      success: true,
      data: group,
    });
  } catch (error) {
    console.error("Create LineItemGroup Error:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

// READ all LineItemGroups for an Estimation
const getLineItemGroups = async (req, res) => {
  try {
    const { estimationId } = req.params;

    if (!estimationId) {
      return sendResponse({
        message: "EstimationId is required",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const groups = await prisma.estimationLineItemGroup.findMany({
      where: { estimationId },
      include: { lineItems: true },
    });

    return sendResponse({
      message: "LineItemGroups fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: groups,
    });
  } catch (error) {
    console.error("Get LineItemGroups Error:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

// READ single LineItemGroup by ID
const getLineItemGroupById = async (req, res) => {
  try {
    const { id } = req.params;

    const group = await prisma.estimationLineItemGroup.findUnique({
      where: { id },
      include: { lineItems: true },
    });

    if (!group) {
      return sendResponse({
        message: "LineItemGroup not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    return sendResponse({
      message: "LineItemGroup fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: group,
    });
  } catch (error) {
    console.error("Get LineItemGroup Error:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

// UPDATE a LineItemGroup
const updateLineItemGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, lineItems } = req.body;

    const existing = await prisma.estimationLineItemGroup.findUnique({
      where: { id },
      include: { lineItems: true },
    });

    if (!existing) {
      return sendResponse({
        message: "LineItemGroup not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    const updatedGroup = await prisma.estimationLineItemGroup.update({
      where: { id },
      data: {
        name: name ?? existing.name,
        description: description ?? existing.description,
        lineItems: lineItems
          ? {
              deleteMany: {}, // remove existing and replace
              create: lineItems,
            }
          : undefined,
      },
      include: { lineItems: true },
    });

    return sendResponse({
      message: "LineItemGroup updated successfully",
      res,
      statusCode: 200,
      success: true,
      data: updatedGroup,
    });
  } catch (error) {
    console.error("Update LineItemGroup Error:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

// DELETE a LineItemGroup
const deleteLineItemGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await prisma.estimationLineItemGroup.delete({
      where: { id },
    });

    return sendResponse({
      message: "LineItemGroup deleted successfully",
      res,
      statusCode: 200,
      success: true,
      data: deleted,
    });
  } catch (error) {
    console.error("Delete LineItemGroup Error:", error);
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
  createLineItemGroup,
  getLineItemGroups,
  getLineItemGroupById,
  updateLineItemGroup,
  deleteLineItemGroup,
};
