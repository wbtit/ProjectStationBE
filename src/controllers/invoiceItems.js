import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

export const addInvoiceItem = async (req, res) => {
  try {
    const { id: invoiceId } = req.params;
    const { description, sacCode, unit, rateUSD, totalUSD, remarks } = req.body;

    const item = await prisma.invoiceItem.create({
      data: {
        invoiceId,
        description,
        sacCode,
        unit,
        rateUSD,
        totalUSD,
        remarks,
      },
    });

    return sendResponse({
      message: "Invoice item added successfully",
      res,
      statusCode: 201,
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Add Invoice Item Error:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

export const updateInvoiceItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const data = req.body;

    const item = await prisma.invoiceItem.update({
      where: { id: itemId },
      data,
    });

    return sendResponse({
      message: "Invoice item updated successfully",
      res,
      statusCode: 200,
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Update Invoice Item Error:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

export const deleteInvoiceItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    await prisma.invoiceItem.delete({
      where: { id: itemId },
    });

    return sendResponse({
      message: "Invoice item deleted successfully",
      res,
      statusCode: 200,
      success: true,
      data: null,
    });
  } catch (error) {
    console.error("Delete Invoice Item Error:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};
