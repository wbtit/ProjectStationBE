import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import path from "path";
import fs from "fs";
import mime from "mime";
import { fileURLToPath } from "url";

// Recreate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createDesignDrawing = async (req, res) => {
  try {
    const { description, stage } = req.body;
    const { projectId } = req.params;
    const { id } = req.user;

    if (!projectId || !description || !stage) {
      return sendResponse({
        message: "Project ID, description, and stage are required",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    // Optionally, you can validate if the projectId exists in the database
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return sendResponse({
        message: "Project not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }
    const fileDetails = req.files.map((file) => ({
          filename: file.filename, // UUID + extension
          originalName: file.originalname, // Original name of the file
          id: file.filename.split(".")[0], // Extract UUID from the filename
          path: `designDrawingtemp/${file.filename}`, // Relative path
        }));

    const newDesignDrawing = await prisma.designDrawings.create({
      data: {
        projectId,
        description,
        stage,
        uploadedBy: id,
        files: fileDetails,
      },
    });

    sendResponse({
        message: "Design drawing created successfully",
        res,
        statusCode: 200,
        success: true,
        data: newDesignDrawing,
      });
  } catch (error) {
    console.error("Error creating design drawing:", error);
    sendResponse({
      message: "Internal server error",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};
const getDesignDrawingsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!projectId) {
      return sendResponse({
        message: "Project ID is required",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const designDrawings = await prisma.designDrawings.findMany({
      where: { projectId },
      include: {
        user: {
          select: { id: true,l_name:true,f_name:true, m_name: true, email: true },
        },
        responses: {
          include: {
            user: {
              select: { id: true, l_name: true, f_name: true, m_name: true, email: true },
            },
          },
        },
      },
      orderBy: { uploadedAt: "desc" },
    });

    sendResponse({
      message: "Design drawings fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: designDrawings,
    });
  } catch (error) {
    console.error("Error fetching design drawings:", error);
    sendResponse({
      message: "Internal server error",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};
const updateDesignDrawingStage = async (req, res) => {
  try {
    const { id } = req.params;
    const { stage,description } = req.body;

    if (!stage) {
      return sendResponse({
        message: "Stage is required",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const updatedDesignDrawing = await prisma.designDrawings.update({
      where: { id },
      data: { stage, description },
    });

    sendResponse({
      message: "Design drawing stage updated successfully",
      res,
      statusCode: 200,
      success: true,
      data: updatedDesignDrawing,
    });
  } catch (error) {
    console.error("Error updating design drawing stage:", error);
    sendResponse({
      message: "Internal server error",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
}
const getAllDesignDrawings = async (req, res) => {
  try {
    const designDrawings = await prisma.designDrawings.findMany({
      include: {
        user: {
          select: { id: true, l_name: true, f_name: true, m_name: true, email: true },
        },
        project: {
          select: { id: true, name: true },
        },
        responses: {
          include: {
            user: {
              select: { id: true, l_name: true, f_name: true, m_name: true, email: true },
            },
          },
        },
      },
      orderBy: { uploadedAt: "desc" },
    });

    sendResponse({
      message: "All design drawings fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: designDrawings,
    });
  } catch (error) {
    console.error("Error fetching all design drawings:", error);
    sendResponse({
      message: "Internal server error",
      res,
      statusCode: 500,
      success: false,   
        data: null, 
    });
  }
};
const deleteDesignDrawing = async (req, res) => {
  try {
    const { id } = req.params;

    const designDrawing = await prisma.designDrawings.findUnique({
      where: { id },
    });

    if (!designDrawing) {
      return sendResponse({
        message: "Design drawing not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    await prisma.designDrawings.delete({
      where: { id },
    });

    sendResponse({
      message: "Design drawing deleted successfully",
      res,
      statusCode: 200,
      success: true,
      data: null,
    });
  } catch (error) {
    console.error("Error deleting design drawing:", error);
    sendResponse({
      message: "Internal server error",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const viewDesignDrawingFiles = async (req, res) => {
  const { id, fid } = req.params;

  try {
    // 1. Fetch design drawing record
    
    const designDrawing = await prisma.designDrawings.findUnique({
      where: { id },
    });
    
    if (!designDrawing || !designDrawing.files) {
      return res.status(404).json({ message: "Design drawing or files not found" });
    }

    // 2. Find requested file object
    const fileObject = designDrawing.files.find((file) => file.id === fid);
    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

    console.log("File object:", fileObject);

    // 3. Construct safe absolute path
   const projectRoot = path.join(__dirname, "..", "..", "public");
      const safePath = path.join(projectRoot, fileObject.path);



    console.log("Resolved file path:", safePath);

    if (!fs.existsSync(safePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // 4. Determine MIME type
    const fileExt = path.extname(safePath).toLowerCase();
    const mimeType = mime.getType(safePath) || "application/octet-stream";

    // 5. Set response headers
    if (fileExt === ".zip") {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileObject.originalName}"`
      );
    } else {
      res.setHeader("Content-Type", mimeType);
      res.setHeader(
        "Content-Disposition",
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

const addDesignDrawingResponse = async (req, res) => {
  const { designDrawingId } = req.params;
  const { id } = req.user;
  const { reason, parentResponseId, status,description } = req.body;

  try {
    if(!description || !status || !designDrawingId){
      return sendResponse({
        message:"Feilds are empty",
        res,
        statusCode:400,
        success:false,
        data:null
      })
    }
    const designDrawingStatus= await prisma.designDrawings.update({
      where:{
        id:designDrawingId
      },
      data:{
        status:false
      }
    })
    if (!designDrawingStatus) {
    return sendResponse({
      message: "Failed to update the Status of the Design Drawing to false",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }

  if(parentResponseId!=undefined){
    const parentResponse= await prisma.designDrawingsResponses.update({
      where:{id:parentResponseId},
      data:{
        wbtStatus:status
      }
    })
    if(!parentResponse){
    return sendResponse({
      message: "Failed to update the Status of the parent RFQ",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
  }
  
    const fileDetails = req.files.map((file) => ({
      filename: file.filename, // UUID + extension
      originalName: file.originalname, // Original name of the file
      id: file.filename.split(".")[0], // Extract UUID from the filename
      path: `designdrawingsresponsestemp/${file.filename}`, // Relative path
    }));
    if(parentResponseId!=undefined){
  const updateParentDesignDrawingStatus= await prisma.designDrawingsResponses.update({
  where:{id:parentResponseId},
  data:{
    status:status,
  }
  
})
if (!updateParentDesignDrawingStatus) {
    return sendResponse({
      message: "Failed to update the Status of the Parent Design Drawing",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
    }
    const addresponse= await prisma.designDrawingsResponses.create({
      data:{
        status:status,
        reason:reason,
        userId:id,
        files:fileDetails,
        designDrawingId:designDrawingId,
        parentResponseId:parentResponseId||null
      },
      
    })

    return sendResponse({
      message:"Response created",
      res,
      statusCode:200,
      success:true,
      data:addresponse
    })
    
  } catch (error) {
    console.log(error.message)
    return sendResponse({
      message:"failed to create Response",
      res,
      statusCode:500,
      success:false,
      data:''
    })
  }
}

const getResponse = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await prisma.designDrawingsResponses.findMany({
      where: {
        designDrawingId: id,
      },
      include: {
        files: true,
      },
    });

    if (!response) {
      return sendResponse({
        message: "No responses found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    return sendResponse({
      message: "Responses retrieved successfully",
      res,
      statusCode: 200,
      success: true,
      data: response,
    });
  } catch (error) {
    console.log(error.message);
    return sendResponse({
      message: "Failed to retrieve responses",
      res,
      statusCode: 500,
      success: false,
      data: '',
    });
  }
};
const viewDesignDrawingResponseFiles = async (req, res) => {
  const { id, fid } = req.params;

  try {
    // 1. Fetch design drawing record
    const designDrawingRes = await prisma.designDrawingsResponses.findUnique({
      where: { id },
    });

    if (!designDrawingRes || !designDrawingRes.files) {
      return res.status(404).json({ message: "Design drawing or files not found" });
    }

    // 2. Find requested file object
    const fileObject = designDrawingRes.files.find((file) => file.id === fid);
    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

    console.log("File object:", fileObject);

    // 3. Construct safe absolute path
   const projectRoot = path.join(__dirname, "..", "..", "public");
      const safePath = path.join(projectRoot, fileObject.path);



    console.log("Resolved file path:", safePath);

    if (!fs.existsSync(safePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    // 4. Determine MIME type
    const fileExt = path.extname(safePath).toLowerCase();
    const mimeType = mime.getType(safePath) || "application/octet-stream";

    // 5. Set response headers
    if (fileExt === ".zip") {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileObject.originalName}"`
      );
    } else {
      res.setHeader("Content-Type", mimeType);
      res.setHeader(
        "Content-Disposition",
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

export {
  createDesignDrawing,
  getDesignDrawingsByProject,
  updateDesignDrawingStage,
  getResponse,
  addDesignDrawingResponse,
  getAllDesignDrawings,
  deleteDesignDrawing,
  viewDesignDrawingResponseFiles,
  viewDesignDrawingFiles
};