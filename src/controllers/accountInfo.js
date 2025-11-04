import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

export const addAccountInfo = async (req, res) => {
  try {
    
    const data = req.body;

    const account = await prisma.accountInfo.create({
      data:data ,
    });

    return sendResponse({
      message: "Account info added successfully",
      res,
      statusCode: 201,
      success: true,
      data: account,
    });
  } catch (error) {
    console.error("Add Account Info Error:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

export const updateAccountInfo = async (req, res) => {
  try {
    const { id: invoiceId } = req.params;
    const data = req.body;

    const account = await prisma.accountInfo.updateMany({
      where: { invoiceId },
      data,
    });

    return sendResponse({
      message: "Account info updated successfully",
      res,
      statusCode: 200,
      success: true,
      data: account,
    });
  } catch (error) {
    console.error("Update Account Info Error:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

export const getAccountInfo = async (req, res) => {
  try {
    const { id} = req.params;

    const account = await prisma.accountInfo.findMany({
      where: { id },
    });

    return sendResponse({
      message: "Fetched account info successfully",
      res,
      statusCode: 200,
      success: true,
      data: account,
    });
  } catch (error) {
    console.error("Get Account Info Error:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

export const getAllAccountInfo = async(req,res)=>{
    try {
        const accountsInfo = await prisma.accountInfo.findMany();

        return sendResponse({
      message: "Fetched account info successfully",
      res,
      statusCode: 200,
      success: true,
      data: accountsInfo,
    });
    } catch (error) {
      console.error("Get Account Info Error:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });  
    }

}
