import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";



export const createInvoice = async (req, res) => {
  try {
    const { projectId, fabricatorId, customerName, contactName, address, stateCode, GSTIN, invoiceNumber, placeOdSupply, jobName, currencyType, TotalInvoiveValues, TotalInvoiveValuesinWords, invoiceItems, accountInfo } = req.body;

    if (!projectId || !fabricatorId || !customerName || !invoiceNumber) {
      return sendResponse({
        message: "Required fields missing",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const invoice = await prisma.invoice.create({
      data: {
        projectId,
        fabricatorId,
        customerName,
        contactName,
        address,
        stateCode,
        GSTIN,
        invoiceNumber,
        placeOdSupply,
        jobName,
        currencyType,
        TotalInvoiveValues,
        TotalInvoiveValuesinWords,
        invoiceItems: {
          create: invoiceItems || [],
        },
        accountInfo: {
          create: accountInfo || [],
        },
      },
      include: { invoiceItems: true, accountInfo: true },
    });

    return sendResponse({
      message: "Invoice created successfully",
      res,
      statusCode: 201,
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Create Invoice Error:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

export const getAllInvoices = async (req, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { invoiceItems: true, accountInfo: true },
    });

    return sendResponse({
      message: "Fetched all invoices successfully",
      res,
      statusCode: 200,
      success: true,
      data: invoices,
    });
  } catch (error) {
    console.error("Get All Invoices Error:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

export const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { invoiceItems: true, accountInfo: true },
    });

    if (!invoice) {
      return sendResponse({
        message: "Invoice not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    return sendResponse({
      message: "Fetched invoice successfully",
      res,
      statusCode: 200,
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Get Invoice By ID Error:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

export const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const invoice = await prisma.invoice.update({
      where: { id },
      data,
      include: { invoiceItems: true, accountInfo: true },
    });

    return sendResponse({
      message: "Invoice updated successfully",
      res,
      statusCode: 200,
      success: true,
      data: invoice,
    });
  } catch (error) {
    console.error("Update Invoice Error:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

export const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.invoice.delete({
      where: { id },
    });

    return sendResponse({
      message: "Invoice deleted successfully",
      res,
      statusCode: 200,
      success: true,
      data: null,
    });
  } catch (error) {
    console.error("Delete Invoice Error:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};
