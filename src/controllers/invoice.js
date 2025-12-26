import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import invoiceNumberGenerator from "../utils/invoiveNUmGenerator.js";


export const createInvoice = async (req, res) => {
  try {
    const { projectId, fabricatorId,paymentMethod,customerName, contactName, address,clientId, stateCode, GSTIN, placeOfSupply, jobName, currencyType, totalInvoiceValue, totalInvoiceValueInWords, invoiceItems, accountInfo } = req.body;
    const {id}=req.user
    if (!projectId || !fabricatorId || !customerName ||!clientId) {
      return sendResponse({
        message: "Required fields missing",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
console.log("**************************************");

    console.log("The invoice data",req.body)
console.log("**************************************");
    const invoice = await prisma.invoice.create({
  data: {
    projectId,
    fabricatorId,
    customerName,
    contactName,
    paymentMethod,
    clientId,
    address,
    stateCode,
    GSTIN,
    invoiceNumber: await invoiceNumberGenerator(),
    placeOfSupply,
    jobName,
    currencyType,
    totalInvoiceValue: totalInvoiceValue || 0,
    totalInvoiceValueInWords: totalInvoiceValueInWords || "",
    createdBy: id,

    // ⚠️ Since pointOfContact is a Many-to-Many, use "connect"
    pointOfContact: {
      connect: [{ id: clientId }], // Use array since it’s Users[]
    },

    // 🧾 Invoice Items (1:N)
    invoiceItems: {
      create: invoiceItems?.create || invoiceItems || [],
    },

    // 🏦 Account Info (1:N)
    accountInfo: {
      create: accountInfo?.create || accountInfo || [],
    },
  }, 
  include: {
    invoiceItems: true,
    accountInfo: true,
    pointOfContact: true,
  },
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
  const user = req.user
  
  try {
    let invoices;

     if(user.is_pmo||user.is_superuser){
      invoices= await prisma.invoice.findMany({
      include: { invoiceItems: true, accountInfo: true ,pointOfContact:true},
    });
    
     }else{
       invoices = await prisma.invoice.findMany({
      where:{
        clientId:user.id
      },
       include: { invoiceItems: true, accountInfo: true ,pointOfContact:true},
     })
     }
    //  console.log("The invoces",invoices)
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
      include: { invoiceItems: true, accountInfo: true,pointOfContact:true },
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
    // Destructure all fields from the body to separate relational IDs and other data
    const { 
      invoiceItems, 
      accountInfo, 
      pointOfContact, 
      projectId, 
      fabricatorId, 
      paymentMethod,
      clientId,
      // Exclude fields that should not be updated directly
      id: bodyId,
      createdAt,
      updatedAt,
      createdBy,
      TotalInvoiveValuesinWords, // Typo from client
      TotalInvoiveValues,        // Typo from client
      ...invoiceData 
    } = req.body;
    
    console.log("Updating invoice with data:", req.body);

    const updatedInvoice = await prisma.$transaction(async (tx) => {
      // 1. Update the scalar fields of the invoice
      await tx.invoice.update({
        where: { id },
        data: {
          ...invoiceData,
          // Connect relations if their IDs are provided in the request
          ...(projectId && { project: { connect: { id: projectId } } }),
          ...(fabricatorId && { fabricator: { connect: { id: fabricatorId } } }),
          ...(clientId && { pointOfContact: { set: [{ id: clientId }] } }),
        },
      });

      // 2. If invoiceItems are provided, delete old ones and create new ones
      if (invoiceItems && Array.isArray(invoiceItems)) {
        // Delete existing items
        await tx.invoiceItem.deleteMany({
          where: { invoiceId: id },
        });
        // Create new items
        await tx.invoiceItem.createMany({
          data: invoiceItems.map((item) => ({ ...item, invoiceId: id })),
        });
      }

      // 3. If accountInfo is provided, delete old ones and create new ones
      // This handles if accountInfo is an object or an array with one object.
      if (accountInfo) {
        const accountInfoList = Array.isArray(accountInfo) ? accountInfo : [accountInfo];

        // Delete existing account info
        await tx.accountInfo.deleteMany({
          where: { invoiceId: id },
        });

        if (accountInfoList.length > 0) {
          // Create new account info
          await tx.accountInfo.createMany({
            data: accountInfoList.map((info) => ({ ...info, invoiceId: id })),
          });
        }
      }

      // 4. Fetch the final updated invoice with all its relations
      return tx.invoice.findUnique({
        where: { id },
        include: { invoiceItems: true, accountInfo: true, pointOfContact: true },
      });
    });
    console.log("Updated invoice:", updatedInvoice);
    return sendResponse({
      message: "Invoice updated successfully",
      res,
      statusCode: 200,
      success: true,
      data: updatedInvoice,
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
