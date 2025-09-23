import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import createEstimationLineItem from "../utils/createEstimationLineItems.js";



//create the estimation
const createEstimation=async(req,res)=>{
const{
rfqId,
estimationNumber,
fabricatorName,
projectName,
estimateDate,
description,
tools,
fabricatorId,
}=req.body

const{id}=req.user
console.log("==============The body fo the Estimation:",req.body)

try {

    if(
    !estimationNumber||
    !fabricatorId||
    !projectName||
    !estimateDate
    ){
        return sendResponse({
            message:"Fields are empty",
            res,
            statusCode:401,
            success:false,
            data:null
        })
    }
    const fileDetails = req.files
      ? req.files.map((file) => ({
          filename: file.filename, // UUID + extension
          originalName: file.originalname, // Original name of the file
          id: file.filename.split(".")[0], // Extract UUID from the filename
          path: `/public/estimationtemp/${file.filename}`, // Relative path
        }))
      : [];


      
    const createEstimation = await prisma.estimation.create({
  data: {
    ...(rfqId && rfqId !== "undefined"
      ? {
          rfq: {
            connect: { id: rfqId },
          },
        }
      : {}),
    createdBy: {
      connect: { id },
    },
    estimationNumber,
    fabricatorName,
    projectName,
    estimateDate,
    description,
    files:fileDetails,
    tools,
    fabricators: {
      connect: { id: fabricatorId },
    },
    assignedById: id,
  },
});

    return sendResponse({
        message:"estimation created successfully",
        res,
        statusCode:200,
        success:true,
        data:createEstimation
    })
} catch (error) {
    console.log(error.message)
    return sendResponse({
        message:error.message,
        res,
        statusCode:500,
        success:false,
        data:null
    })
}
}


const getallEstimation=async(req,res)=>{
    try {
        const getallEstimation= await prisma.estimation.findMany({
            include:{
             rfq:true,
             createdBy:true,
             tasks:true,
             lineItems:true,
             template:true 
            }
        })
        return sendResponse({
            message:"Estimations Fetched successfully",
            res,
            statusCode:200,
            success:true,
            data:getallEstimation
        })
    } catch (error) {
        console.log(error.message)
        return sendResponse({
            message:error.message,
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }
}
const getEstimationById=async(req,res)=>{
    const{estimationId}=req.params
    if(!estimationId){
        return sendResponse({
            message:"estimation is required",
            res,
            statusCode:401,
            success:false,
            data:null
        })
    }
    try {
        const getEstimationById= await prisma.estimation.findUnique({
            where:{id:estimationId},
            include:{
                 rfq:true,
                 createdBy:true,
                 tasks:{
                    include:{
                        assignedTo:{
                            select:{
                                f_name:true,
                                m_name:true,
                                l_name:true
                            }
                        },
                        assignedBy:{
                            select:{
                            f_name:true,
                            m_name:true,
                            l_name:true  
                            }
                        }
                    }
                 },
                 lineItems:true,
                 template:true ,
                 fabricators:true
            }
        })
        return sendResponse({
            message:"estimation details fetched successfully",
            res,
            statusCode:200,
            success:true,
            data:getEstimationById
        })
    } catch (error) {
        console.log(error.message)
        return sendResponse({
            message:error.message,
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }
}


const updateEstimationData=async(req,res)=>{
    const{estimationId}=req.params
    if(!estimationId){
        return sendResponse({
            message:"estimation is required",
            res,
            statusCode:401,
            success:false,
            data:null
        })
    }
    try {
        const updateEstimationData= await prisma.estimation.update({
            where:{id:estimationId},
            data:{            
                estimationNumber ,
                fabricatorName,   
                projectName,      
                estimateDate,     
                tools,       
                status,           
                createdById,      
                fabricatorId,     
                assignedById,     
                finalHours,       
                finalWeeks       
            },
            include:{
                 rfq:true,
                 createdBy:true,
                 tasks:true,
                 lineItems:true,
                 template:true 
            }
        })
        return sendResponse({
            message:"Estimation data updated successfully",
            res,
            statusCode:200,
            success:true,
            data:updateEstimationData
        })
    } catch (error) {
        console.log(error.message)
        return sendResponse({
            message:error.message,
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }
}
const deleteEstimationData=async(req,res)=>{
    const{estimationId}=req.params
    if(!estimationId){
        return sendResponse({
            message:"estimation is required",
            res,
            statusCode:401,
            success:false,
            data:null
        })
    }
    try {
        const deleteData= await prisma.estimation.delete({
            where:{id:estimationId}
        })
        return sendResponse({
            message:"Estimation Data Deleted successfully",
            res,
            statusCode:200,
            success:true,
            data:deleteData
        })
    } catch (error) {
        console.log(error.message)
        return sendResponse({
            message:error.message,
            res,
            statusCode:500,
            success:false,
            data:null
        })
    }
}
const updateStatus=async(req,res)=>{
    const{estimationId,status}=req.params

    if(!estimationId || !status){
        return sendResponse({
            message:"estimation and status is required",
            res,
            statusCode:401,
            success:false,
            data:null
        })
    }
    try {
        const statusUpdated= await prisma.estimation.update({
        where:{id:estimationId},
        data:{
            status:status
        },include:{
                 rfq:true,
                 createdBy:true,
                 tasks:true,
                 lineItems:true,
                 template:true 
            }
    })
    return sendResponse({
        message:"Status got updated successfully",
        res,
        statusCode:200,
        success:true,
        data:statusUpdated
    })
    } catch (error) {
      console.log(error.message)
      return sendResponse({
        message:error.message,
        res,
        statusCode:500,
        success:false,
        data:null
      })  
    }
}

const setFinalPrice=async(req,res)=>{
    const{estimationId}=req.params
    const{finalPrice}=req.body
    if(!finalPrice){
        return sendResponse({
            mesetFinalPricessage:"Final Price is required",
            res,
            statusCode:401,
            success:false,
            data:null
        })
    }
    try {
        const setPrice = await prisma.estimation.update({
            where:{id:estimationId},
            data:{
                finalPrice:finalPrice
            },include:{
                rfq:true,
                createdBy:true,
                tasks:true,
                lineItems:true,
                template:true  
            }
        })
        return sendResponse({
            message:"Final Price is updated",
            res,
            statusCode:200,
            success:true,
            data:setPrice
        })
    } catch (error) {
        console.log(error.message)
            return sendResponse({
              message:error.message,
              res,
              statusCode:500,
              success:false,
              data:null
      })  
    }
}

const estimationsViewFiles = async (req, res) => {
  const { id, fid } = req.params;
  //console.log("I am viewfile route",id)
  try {
    const est = await prisma.estimation.findUnique({
      where: { id },
    });

    if (!est) {
      return res.status(404).json({ message: "Estimation not found" });
    }

    const fileObject = est.files.find((file) => file.id === fid);

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

const updateEstimationLineItem = async (req, res) => {
    const { lineItemId } = req.params;

    if (!lineItemId) {
        return sendResponse({
            message: "Line item ID is required",
            res,
            statusCode: 400,
            success: false,
            data: null,
        });
    }

    const {
        scopeOfWork,
        remarks,
        quantity,
        hoursPerQty,
        totalHours,
        weeks,
    } = req.body;

    try {
        const updatedLineItem = await prisma.estimationLineItem.update({
            where: { id: lineItemId },
            data: {
                scopeOfWork,
                remarks,
                quantity,
                hoursPerQty,
                totalHours,
                weeks,
            },
        });

        return sendResponse({
            message: "Estimation line item updated successfully",
            res,
            statusCode: 200,
            success: true,
            data: updatedLineItem,
        });

    } catch (error) {
        console.error(error.message);
        return sendResponse({
            message: error.message || "Failed to update line item",
            res,
            statusCode: 500,
            success: false,
            data: null,
        });
    }
};

const createLineItem = async (req, res) => {
  const {
    scopeOfWork,
    remarks,
    quantity,
    hoursPerQty,
    totalHours,
    weeks
  } = req.body;
const {groupId}=req.params
  try {
    // ✅ Required field validation
    if (!scopeOfWork || !groupId) {
      return sendResponse({
        message: "Fields are empty",
        res,
        statusCode: 401,
        success: false,
        data: null,
      });
    }

    // ✅ Create Line Item
    const lineItem = await prisma.estimationLineItem.create({
      data: {
        scopeOfWork,
        remarks,
        quantity: quantity ? parseFloat(quantity) : null,
        hoursPerQty: hoursPerQty ? parseFloat(hoursPerQty) : null,
        totalHours: totalHours ? parseFloat(totalHours) : null,
        weeks: weeks ? parseFloat(weeks) : null,
        group: {
          connect: { id: groupId },
        },
      },
    });

    return sendResponse({
      message: "Estimation line item created successfully",
      res,
      statusCode: 200,
      success: true,
      data: lineItem,
    });
  } catch (error) {
    console.error(error.message);
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
    createEstimation,
    getallEstimation,
    getEstimationById,
    updateEstimationData,
    deleteEstimationData,
    updateStatus,
    setFinalPrice,
    estimationsViewFiles,

    updateEstimationLineItem,
    createLineItem
}