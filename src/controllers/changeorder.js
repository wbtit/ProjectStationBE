import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { sendNotification } from "../utils/notify.js";
import { getNextCONumber } from "../utils/generateCoNumber.js";
import path from "path"
import fs from "fs"
import mime from "mime"
import { fileURLToPath } from "url";

// Recreate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const changeOrderReceived=async(req,res)=>{
    const {id}=req.user

    try{
        if(!id){
            return sendResponse({
                message:"Invalid userId",
                res,
                statusCode:411,
                success:false,
                data:null
            })
        }
        const receives= await prisma.changeOrder.findMany({
            where:{
                recipients:id,
                isAproovedByAdmin:true
            },
              select:{
                id:true,
                remarks:true,
                description:true,
                changeOrder:true,
                sentOn:true,
                files:true,
                project:true,
                recipients:true
                
            }
        })
        if(receives.length===0){
            return sendResponse({
                message:"No changeOrder for this user",
                res,
                statusCode:201,
                success:true,
                data:receives
            })
        }
        return sendResponse({
            message:"Fetched all recived ChangeOrder for this user",
            res,
            statusCode:200,
            success:true,
            data:receives
        })
    }catch(error){
        return sendResponse({
            message:error.message,
            res,
            statusCode:500,
            data:null,
            success:false
        })
    }
}
const changeOrderSent=async(req,res)=>{
    const {id}=req.user

    try{
        if(!id){
            return sendResponse({
                message:"Invalid userId",
                res,
                statusCode:411,
                success:false,
                data:null
            })
        }
        const sents= await prisma.changeOrder.findMany({
            where:{
                sender:id
            },
            select:{
                id:true,
                remarks:true,
                description:true,
                changeOrder:true,
                sentOn:true,
                files:true,
                recipients:true,
                project:true
                
                
            }
        })
        if(sents.length===0){
            return sendResponse({
                message:"No sents changeOrders for this user",
                res,
                statusCode:201,
                success:true,
                data:sents
            })
        }
        return sendResponse({
            message:"Fetched all sent ChangeOrders for this user",
            res,
            statusCode:200,
            success:true,
            data:sents
        })
    }catch(error){
        return sendResponse({
            message:error.message,
            res,
            statusCode:500,
            data:null,
            success:false
        })
    }
}



// Create Change Order function
const createCO = async (req, res,approval) => {
  try {
    const { project, recipients, remarks, description, Stage } = req.body;
    console.log("changeOrder body:",req.body)

    if (!project || !recipients || !remarks || !description || !Stage) {
      return sendResponse({
        message: "Fields are empty",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    // Handle file uploads safely
    const fileDetails = req.files
      ? req.files.map((file) => ({
          filename: file.filename, // UUID + extension
          originalName: file.originalname, // Original name of the file
          id: file.filename.split(".")[0], // Extract UUID from the filename
          path: `changeordertemp/${file.filename}`, // Relative path
        }))
      : [];

    // Generate unique CO number
    const coNum = await getNextCONumber();

    // Insert into DB
    const changeorder = await prisma.changeOrder.create({
      data: {
        changeOrder: coNum,
        description,
        project,
        status: "NOT_REPLIED",
        stage: Stage || "IFA",
        recipients,
        remarks,
        isAproovedByAdmin:approval,
        sender: req.user.id,
        files: fileDetails,
      },
    });

    // Notify recipients
    sendNotification(recipients, {
      message: `New CO received: ${remarks}`,
      coId: changeorder.id,
    });

    return sendResponse({
      message: "Change Order Submitted",
      res,
      statusCode: 200,
      success: true,
      data: changeorder,
    });
  } catch (error) {
    //console.log(error.message)
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

// Add Change Order (with permissions)
const AddChangeOrder = async (req, res) => {
  try {
    const {  is_superuser,is_manager,is_staff } = req.user

    if (is_superuser ||(is_manager&& is_staff)) {
      return createCO(req, res,true);
    }else{
      return createCO(req,res,false)
    }
  } catch (error) {
    console.log(error.mes)
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const addCoResponse = async (req, res) => {
  const { coId } = req.params;
  const { id: userId } = req.user; // from auth middleware
  const { status, description, parentResponseId } = req.body;

  try {
    // Validate required fields
    if (!coId || !status || !description) {
      return sendResponse({
        message: "Fields are required",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    // Handle uploaded files
    const fileDetails = req.files
      ? req.files.map((file) => ({
          filename: file.filename,
          originalName: file.originalname,
          id: file.filename.split(".")[0],
          path: `changeOrderResponsetemp/${file.filename}`,
        }))
      : [];

    // Check if user exists
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      return sendResponse({
        message: "User not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    // Check if ChangeOrder exists
    const changeOrder = await prisma.changeOrder.findUnique({ where: { id: coId } });
    if (!changeOrder) {
      return sendResponse({
        message: "Change Order not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    // If parentResponseId is provided, validate it
    let parentConnect = undefined;
    if (parentResponseId) {
      const parentExists = await prisma.cOResponse.findUnique({
        where: { id: parentResponseId },
      });

      if (!parentExists) {
        return sendResponse({
          message: "Parent COResponse not found",
          res,
          statusCode: 404,
          success: false,
          data: null,
        });
      }

      parentConnect = { connect: { id: parentResponseId } };
    }

    // Create COResponse
    const coResponse = await prisma.cOResponse.create({
      data: {
        Status: status,
        description,
        files: fileDetails,
        parentResponse: parentConnect,
        user: { connect: { id: userId } },
        COresponse: { connect: { id: coId } },
      },
    });

    return sendResponse({
      message: "COResponse created successfully",
      res,
      statusCode: 200,
      success: true,
      data: coResponse,
    });

  } catch (error) {
    console.error("Error creating COResponse:", error.message);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};


const getResponse=async(req,res)=>{
  const{id}=req.params
  try {
    
    const response= await prisma.cOResponse.findUnique({
      where:{id:id},
      include:{
        file:true,
        childResponses:true,
        user:{
          select:{
            f_name:true,
            m_name:true,
            l_name:true
          }
        }
      }
    })
    return sendResponse({
      message:"Respose is fetched successfully",
      res,
      statusCode:200,
      success:true,
      data:response
    })
  } catch (error) {
    console.log(error.message)
    return sendResponse({
      message:"Failed to fetch responses",
      res,
      statusCode:500,
      success:false,
      data:null
    })
  }
}

const AddChangeOrdertable = async (req, res) => {
  const { coId } = req.params;
  const changeOrderItems = Object.values(req.body);
  const currentUser = req.user; // assuming middleware sets this
  const userId = currentUser?.id || "UNKNOWN";

  //console.log("ChangeOrderTable data:", changeOrderItems);

  try {
    if (!Array.isArray(changeOrderItems) || changeOrderItems.length === 0) {
      return sendResponse({
        message: "Fields are empty or invalid format",
        res,
        statusCode: 400,
        success: false,
        data: null
      });
    }

    const dataToInsert = changeOrderItems.map(co => ({
      description: co.description,
      referenceDoc: co.referenceDoc,
      elements: co.elements,
      QtyNo: co.QtyNo,
      hours: co.hours,
      remarks: co.remarks ?? "", 
      cost: co.cost,
      costUpdatedBy: userId,   
      costUpdatedAt: new Date(),
      CoId: coId  // from params
    }));

    //console.log("ChangeOrderTable data:", dataToInsert);

    const created = await prisma.changeOrdertable.createMany({
      data: dataToInsert,
      skipDuplicates: true // optional: avoids inserting duplicates
    });

    return sendResponse({
      message: "Change Order Table created",
      res,
      statusCode: 200,
      success: true,
      data: created
    });

  } catch (error) {
    console.error(error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};



const getRowCotable = async (req, res) => {
  const { CoId } = req.params;
  const currentUser = req.user; // from auth middleware
  const userId=currentUser.id


  console.log("The CoID:", CoId);

  try {
    if (!CoId) {
      return sendResponse({
        message: "Fields are empty",
        res,
        statusCode: 400,
        success: false,
        data: null
      });
    }

    // fetch rows
    let coRow = await prisma.changeOrdertable.findMany({
      where: { CoId }
    });

    // apply visibility rule for PMs
    if (currentUser.is_manager && !currentUser.is_staff) {
      coRow = coRow.map(row => {
        if (row.costUpdatedBy !==userId) {
          return { ...row, cost: null };
        }
        return row;
      });
    }

    // fetch parent CO with related info
    const CO = await prisma.changeOrder.findUnique({
      where: { id: CoId },
      include: {
        senders: {
          select: { f_name: true, m_name: true, l_name: true }
        },
        Project: {
          select: { name: true }
        }
      }
    });

    const response = { coRow, CO };

    return sendResponse({
      message: "Response created",
      res,
      statusCode: 200,
      success: true,
      data: response
    });

  } catch (error) {
    console.error(error.message);
    return sendResponse({
      message: "Failed to fetch the CoRow",
      res,
      statusCode: 500,
      success: false,
      data: ''
    });
  }
};


const viewCOfiles = async (req, res) => {
  const { id, fid } = req.params;

  try {
    // Fetch Change Order and its files
    const CO = await prisma.changeOrder.findUnique({
      where: { id:id }, // Use parseInt if ID is numeric
   
    });

    if (!CO) {
      return res.status(404).json({ message: "Change Order not found" });
    }

    // Find the file by its UUID
    const fileObject = CO.files.find((file) => file.id === fid);

    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

    // 3. Construct safe absolute path
   const projectRoot = path.join(__dirname, "..", "..", "public");

   const safePath = path.join(projectRoot, fileObject.path);
    // Check if file exists
    if (!fs.existsSync(safePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // Get file extension and MIME type
    const fileExt = path.extname(safePath).toLowerCase();
    const mimeType = mime.getType(safePath) || 'application/octet-stream';

    // Handle .zip files: force download
    if (fileExt === '.zip') {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileObject.originalName}"`
      );
    } else {
      // Inline view for other types
      res.setHeader('Content-Type', mimeType);
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${fileObject.originalName}"`
      );
    }
        // 6. Stream file to client
        const fileStream = fs.createReadStream(safePath);
        fileStream.pipe(res);
    
        fileStream.on("error", (err) => {
          console.error("File stream error:", err);
          res.status(500).json({ message: "Error reading file" });
        });
      } catch (error) {
        console.error("View File Error:", error); 
        return res.status(500).json({
          message: "Something went wrong while viewing the file",
          error: error.message,
        });
      }
    };


const changeStatus=async(req,res)=>{
  const {coId}=req.params
  const{status,reason}=req.body
  console.log(req.body)
  try {
    if(!status){
      return sendResponse({
        message:"Status is required",
        res,
        statusCode:400,
        success:false,
        data:null
      })
    }
    const updateStatus= await prisma.changeOrder.update({
      where:{
        id:coId
      },
      data:{
        status:status,
        reason:reason
      }
    })
    return sendResponse({
      message:"Status updated successfully",
      res,
      statusCode:200,
      success:true,
      data:updateStatus
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

const getChangeOrderByProjectId=async(req,res)=>{
  const{projectId}=req.params
  //console.log("-=-=-=-=---",projectId)
  try {
    if(!projectId){
      return sendResponse({
        message:"ProjectId is required",
        res,
        statusCode:401,
        success:false,
        data:null
      })
    }
    const getRFI= await prisma.changeOrder.findMany({
      where:{project:projectId},
      include:{
        Project:true,
        Recipients:true,
        senders:true,
        coResponse:true,
        CoRefersTo:true
      }
    })
    return sendResponse({
      message:"CO fetched by ProjectId",
      res,
      statusCode:200,
      success:true,
      data:getRFI
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


const updateChangeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      project,
      recipients,
      remarks,
      changeOrder,
      description,
      sender,
      files,
      status,
      reason,
      stage,
      isAproovedByAdmin
    } = req.body;

    // Update ChangeOrder
    const updatedChangeOrder = await prisma.changeOrder.update({
      where: { id },
      data: {
        project,
        recipients,
        remarks,
        changeOrder,
        description,
        sender,
        files,
        stage,
        status,
        reason,
        isAproovedByAdmin
      }
    });

    return res.status(200).json({
      success: true,
      message: "ChangeOrder updated successfully",
      data: updatedChangeOrder
    });

  } catch (error) {
    console.error("Update ChangeOrder Error:", error);

    if (error.code === "P2025") {
      // Record not found
      return res.status(404).json({
        success: false,
        message: "ChangeOrder not found"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update ChangeOrder",
      error: error.message
    });
  }
};

const updateChangeOrderTable = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      description,
      referenceDoc,
      elements,
      QtyNo,
      remarks,
      hours,
      cost,
      CoId
    } = req.body;

    const currentUser = req.user; // middleware should inject
    const userId = currentUser.id

    // Update ChangeOrdertable record
    const updatedChangeOrderTable = await prisma.changeOrdertable.update({
      where: { id },
      data: {
        description,
        referenceDoc,
        elements,
        QtyNo,
        remarks,
        hours,
        cost,
        CoId,
        ...(cost !== undefined && {
          costUpdatedBy: userId,        
          costUpdatedAt: new Date() 
        })
      }
    });

    return res.status(200).json({
      success: true,
      message: "ChangeOrdertable updated successfully",
      data: updatedChangeOrderTable
    });

  } catch (error) {
    console.error("Update ChangeOrdertable Error:", error);

    if (error.code === "P2025") {
      // Record not found
      return res.status(404).json({
        success: false,
        message: "ChangeOrdertable not found"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update ChangeOrdertable",
      error: error.message
    });
  }
};


export { 
  AddChangeOrder ,
  changeOrderReceived,
  changeOrderSent,
  updateChangeOrder,

  addCoResponse,
  getResponse,

  AddChangeOrdertable,
  updateChangeOrderTable,
  
  getRowCotable,

  viewCOfiles,

  changeStatus,
  getChangeOrderByProjectId
};
