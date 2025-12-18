import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { sendEmail } from "../../service/gmailservice/index.js";
import path from "path"
import fs from "fs"
import mime from "mime"
import { sendNotification } from "../utils/notify.js";
import { fileURLToPath } from "url";

// Recreate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const createRFI=async(req,res,approval)=>{
  const{project_id,recipient_id,subject, description,fabricator_id}=req.body
  const{id}=req.user
    try {
    if (!project_id || !recipient_id || !subject || !description) {
      return sendResponse({
        message: "Fields are empty",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    const fileDetails = req.files.map((file) => ({
      filename: file.filename, // UUID + extension
      originalName: file.originalname, // Original name of the file
      id: file.filename.split(".")[0], // Extract UUID from the filename
      path: `rfitemp/${file.filename}`, // Relative path
    }));

    const newrfi = await prisma.rFI.create({
      data: {
        fabricator_id:
          fabricator_id,
        project_id,
        recepient_id: recipient_id,
        sender_id: id,
        status: true,
        subject,
        description,
        files: fileDetails,
        isAproovedByAdmin:approval
        
      },
      include: {
        recepients: true,
        project: true,
        sender : true,
        rfiresponse:true
      },
    });

    const htmlContent = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Whiteboard Engineering - Project Update</title>

    <style type="text/css">
      /* Global Reset */
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, Helvetica, sans-serif;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #f6f7f9;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      td {
        padding: 0;
      }
      img {
        border: 0;
        outline: none;
        text-decoration: none;
        display: block;
        -ms-interpolation-mode: bicubic;
      }
      a {
        text-decoration: none;
        color: #8cc63f;
      }
      .main-content-wrapper {
        max-width: 600px;
        width: 100%;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
      }

      /* Typography */
      .title {
        font-size: 18px;
        font-weight: 600;
        color: #333333;
      }
      .subtitle {
        font-size: 14px;
        color: #555555;
        line-height: 20px;
      }
      .divider {
        background-color: #8cc63f;
        height: 4px;
      }

      /* Mobile Styles */
      @media only screen and (max-width: 600px) {
        .main-content-wrapper {
          width: 100% !important;
        }
        .content-padding {
          padding: 0 20px !important;
        }
        .logo-cell {
          padding: 20px 20px 10px 20px !important;
          text-align: center !important;
        }
        .project-name-cell {
          text-align: center !important;
          padding-top: 5px !important;
        }
        .button-link {
          width: 100% !important;
        }
      }
    </style>
  </head>

  <body style="margin: 0; padding: 0; background-color: #f6f7f9">
    <table align="center" width="100%" bgcolor="#f6f7f9">
      <tr>
        <td align="center" valign="top" style="padding: 30px 10px">
          <table
            class="main-content-wrapper"
            align="center"
            cellpadding="0"
            cellspacing="0"
          >
            <!-- Header -->
            <tr>
              <!-- Left: Logo (30%) -->
              <td
                align="left"
                style="
                  width: 30%;
                  padding: 20px 20px 10px 30px;
                  background-color: #ffffff;
                  vertical-align: middle;
                "
                class="logo-cell"
              >
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9"
                  alt="Whiteboard Engineering Logo"
                  width="140"
                  style="max-width: 100%; height: auto; display: block"
                />
              </td>

              <!-- Right: Project Name (70%) -->
              <td
                align="right"
                style="
                  width: 70%;
                  padding: 20px 30px 10px 10px;
                  font-family: Arial, sans-serif;
                  font-size: 18px;
                  font-weight: 600;
                  color: #ffffff;
                  background-color: #8cc63f;
                  text-align: left;
                  vertical-align: middle;
                "
                class="project-name-cell"
              >
                ${newrfi?.project?.name || "N/A"}
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td colspan="2" class="divider"></td>
            </tr>

            <!-- Body -->
            <tr>
              <td colspan="2" style="padding: 30px 40px">
                <p style="margin: 0 0 5px 0; font-size: 13px; color: #888888">
                  Date: ${
                    newrfi?.date || new Date().toLocaleDateString()
                  }
                </p>

                <p
                  style="
                    margin: 15px 0;
                    font-size: 16px;
                    font-weight: bold;
                    color: #333333;
                  "
                >
                  Subject: Status Update for ${newrfi.subject || "N/A"}
                </p>

                <p
                  style="
                    margin: 20px 0;
                    font-size: 15px;
                    color: #333333;
                    line-height: 24px;
                  "
                >
                  Dear ${newrfi?.recepients?.f_name || "Sir/Ma'am"},
                </p>

                <p
                  style="
                    margin: 10px 0 25px 0;
                    font-size: 15px;
                    color: #333333;
                    line-height: 24px;
                  "
                >
                  ${newrfi?.description || "No description provided."}
                </p>

                <!-- Button -->
                <p align="center" style="margin: 30px 0 40px 0">
                  <a
                    href="https://projectstation.whiteboardtec.com/"
                    target="_blank"
                    style="
                      background-color: #8cc63f;
                      border: 1px solid #8cc63f;
                      border-radius: 6px;
                      color: #ffffff;
                      display: inline-block;
                      font-size: 14px;
                      font-weight: bold;
                      line-height: 18px;
                      text-align: center;
                      padding: 12px 30px;
                      text-decoration: none;
                      letter-spacing: 0.5px;
                    "
                  >
                    Login With Your Credentials
                  </a>
                </p>

                <!-- Signature -->
                <p style="font-size: 15px; color: #333333; margin-bottom: 10px">
                  Thanks & Regards,
                </p>

                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td valign="top" style="padding-right: 15px">
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9"
                        alt="Sender"
                        width="80"
                        height="auto"
                        style="border-radius: 10%; display: block"
                      />
                    </td>

                    <td valign="middle">
                      <p
                        style="
                          margin: 0;
                          font-size: 16px;
                          font-weight: bold;
                          color: #333333;
                        "
                      >
                        ${[
                          newrfi?.sender?.f_name,
                          newrfi?.sender?.m_name,
                          newrfi?.sender?.l_name,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      </p>
                      <p style="margin: 2px 0; font-size: 14px; color: #888888">
                        ${newrfi?.sender?.designation || "N/A"}
                      </p>
                      <p style="margin: 2px 0; font-size: 14px; color: #888888">
                        Whiteboard Engineering |
                        <a
                          href="https://whiteboardtec.com/"
                          style="color: #8cc63f"
                          >whiteboardtec.com</a
                        >
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                colspan="2"
                align="center"
                style="padding: 20px 30px 30px 30px; background-color: #f6f7f9"
              >
                <p
                  style="
                    margin: 0;
                    font-size: 12px;
                    color: #aaaaaa;
                    line-height: 18px;
                  "
                >
                  © ${new Date().getFullYear()} Whiteboard Engineering. All
                  Rights Reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

 `;

    sendEmail({
      html: htmlContent,
      to: newrfi.recepients.email,
      subject: subject,
      text: description,
    });

    if (!newrfi) {
      return sendResponse({
        message: "Failed to create RFI",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }


    // Emit real-time notification using socket.io
     sendNotification(recipient_id,{
      message:`New RFI received :${newrfi.subject}`,
      rfiId:newrfi.id
     })
    return sendResponse({
      message: "RFI added successfully",
      res,
      statusCode: 200,
      success: true,
      data: newrfi,
    });
  } catch (error) {
    console.log(error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
}


const addRFI = async (req, res) => {
 try {
   const {  is_superuser,is_manager,is_staff } = req.user
   
       if (is_superuser ||(is_manager&& is_staff)) {
         return createRFI(req, res,true);
       }else{
         return createRFI(req,res,false)
       }
     } catch (error) {
       console.log(error.message)
       return sendResponse({
         message: error.message,
         res,
         statusCode: 500,
         success: false,
         data: null,
       });
     }
   


};
// Update RFI Handler
const updateRFI = async (req, res) => {
  const { id } = req.params; // RFI ID
  const {
    subject,
    description,
    status,
    isAproovedByAdmin,
    isDeputyManagerAprooved,
    isDeptManagerAprooved,
    files,
  } = req.body;

  try {
    // 1. Check if RFI exists
    const existing = await prisma.rFI.findUnique({
      where: { id },
    });

    if (!existing) {
      return sendResponse({
        message: "RFI not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    // 2. Update only provided fields
    const updatedRFI = await prisma.rFI.update({
      where: { id },
      data: {
        subject: subject ?? existing.subject,
        description: description ?? existing.description,
        status: typeof status === "boolean" ? status : existing.status,
        isAproovedByAdmin:
          typeof isAproovedByAdmin === "boolean"
            ? isAproovedByAdmin
            : existing.isAproovedByAdmin,
        files: files ?? existing.files,
        isDeputyManagerAprooved:isDeputyManagerAprooved??existing.isDeputyManagerAprooved,
    isDeptManagerAprooved:isDeptManagerAprooved??existing.isDeptManagerAprooved,
      },
    });

    // 3. Send success response
    return sendResponse({
      message: "RFI updated successfully",
      res,
      statusCode: 200,
      success: true,
      data: updatedRFI,
    });
  } catch (error) {
    console.error("Error updating RFI:", error.message);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};


const sentRFIByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const sentRFI = await prisma.rFI.findMany({
      where: {
        sender_id: id,
      },
      include: {
        fabricator: true,
        project: true,
        recepients: true,
        rfiresponse:true,
        file:true
      },
    });
    //console.log("sentRFI:",sentRFI)
    if (!sentRFI) {
      return sendResponse({
        message: "Failed to get RFIs",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "Sent RFIs fetched success",
      res,
      statusCode: 200,
      success: true,
      data: sentRFI,
    });
  } catch (error) {
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const RFIByID = async (req, res) => {
  const { id } = req.params;

  try {
    const rfi = await prisma.rFI.findUnique({
      where: { id },
      include: {
        project:{select:{name:true}},
        recepients: {
          include: {
            fabricator: {
              select: {
                fabName: true,
                headquaters: true,
              },
            },
          },
        },
        rfiresponse: true,
        file: true,
      },
    });

    if (!rfi) {
      return sendResponse({
        message: "RFI not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    const filtered = {
      ...rfi,
      rfiresponse: Array.isArray(rfi.rfiresponse)
        ? rfi.rfiresponse.filter(resp => resp.parentResponseId === null)
        : [],
    };

    sendResponse({
      message: "RFI fetch success",
      res,
      statusCode: 200,
      success: true,
      data: filtered,
    });
  } catch (error) {
    sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};


const Inbox = async (req, res) => {
  const { id } = req.user;
  try {
    const sentRFI = await prisma.rFI.findMany({
      where: {
        recepient_id: id,
      },
      include: {
        fabricator: true,
        project: true,
        recepients: true,
        rfiresponse:true,
        file:true
      },
    });
    //console.log("Received RFI:",sentRFI)
    if (!sentRFI) {
      return sendResponse({
        message: "Failed to get RFIs",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "Inbox RFIs fetched success",
      res,
      statusCode: 200,
      success: true,
      data: sentRFI,
    });
  } catch (error) {
    // console.log(error.message);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const RFIseen = async (req, res) => {
  const { id } = req?.params;
  try {
    const rfiseen = await prisma.rFI.update({
      where: {
        id,
      },
      data: {
        status: false,
      },
    });
    if (!rfiseen) {
      return sendResponse({
        message: "Failed to update",
        res,
        statusCode: 500,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "Status updated successfully",
      res,
      statusCode: 200,
      success: true,
      data: rfiseen,
    });
  } catch (error) {
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};


const viewRFIfiles = async (req, res) => {
  const { id, fid } = req.params;

  try {
    const rfi = await prisma.rFI.findUnique({ where: { id } });

    if (!rfi || !rfi.files) {
      return res.status(404).json({ message: "RFI or files not found" });
    }

    const fileObject = rfi.files.find((file) => file.id === fid);
    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

    console.log("File object:", fileObject);

    // ✅ Use persistent public path from env
    const projectRoot =
      process.env.PUBLIC_DIR || path.join(__dirname, "..", "..", "public");

    const safePath = path.join(projectRoot, fileObject.path);
    console.log("Resolved file path:", safePath);

    if (!fs.existsSync(safePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    const mimeType = mime.getType(safePath) || "application/octet-stream";
    res.setHeader("Content-Type", mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${fileObject.originalName}"`
    );

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

const viewRFIResponsefiles = async (req, res) => {
  const { id, fid } = req.params;

  try {
    const rfi = await prisma.rFIResponse.findUnique({ where: { id } });

    if (!rfi || !rfi.files) {
      return res.status(404).json({ message: "RFIResponse or files not found" });
    }

    const fileObject = rfi.files.find((file) => file.id === fid);
    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

    console.log("File object:", fileObject);

    // ✅ Use persistent public path from env
    const projectRoot =
      process.env.PUBLIC_DIR || path.join(__dirname, "..", "..", "public");

    const safePath = path.join(projectRoot, fileObject.path);
    console.log("Resolved file path:", safePath);

    if (!fs.existsSync(safePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    const mimeType = mime.getType(safePath) || "application/octet-stream";
    res.setHeader("Content-Type", mimeType);
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${fileObject.originalName}"`
    );

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

const addRFIResponse=async(req,res)=>{
  const{rfiId}=req.params
  const{id}=req.user
  const{responseState,reason,parentResponseId,status}=req.body
  
  try {
    if(!reason){
      return sendResponse({
        message:"Feilds are empty",
        res,
        statusCode:400,
        success:false,
        data:null
      })
    }
    const rfiInReview= await prisma.rFI.update({
      where:{
        id:rfiId
      },
      data:{
        status:false
      }
    })
    if (!rfiInReview) {
    return sendResponse({
      message: "Failed to update the Status of the RFI to false",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }

  if(parentResponseId!=undefined){
    const parentResponse= await prisma.rFIResponse.update({
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
      path: `rfiResponsetemp/${file.filename}`, // Relative path
    }));
    if(parentResponseId!=undefined){
  const updateParentRfqStatus= await prisma.rFIResponse.update({
  where:{id:parentResponseId},
  data:{
    responseState:responseState
  }
  
})
if (!updateParentRfqStatus) {
    return sendResponse({
      message: "Failed to update the Status of the Parent RFI",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
    }
const rfi= await prisma.rFI.findUnique({
  where:{id:rfiId},
  include:{
    sender:true,
    recepients:true
  }
})
if(!rfi){
  return sendResponse({
    message:"RFI not found",
    res,
    statusCode:404,
    success:false,
    data:null
  })
}
// Notify original sender of the RFI
       if(req.user.id !== rfi.sender.id){
    // Notify original sender of the ChangeOrder
    await sendNotification(rfi.sender.id, {
      message: `New response on your RFI: ${rfi.subject}`,
      rfiId: rfi.id,
    });
  }else{
    await sendNotification(rfi.recepients.id, {
      message: `New response on RFI you received: ${rfi.subject}`,
      rfiId: rfi.id,
    });
  }
    const addresponse= await prisma.rFIResponse.create({
      data:{
        responseState:responseState,
        reason:reason,
        userId:id,
        files:fileDetails,
        rfiId:rfiId,
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

const getRfiresponse=async(req,res)=>{
  const{id}=req.params
  //console.log("RFI ID:",id)
  try {
    const response= await prisma.rFIResponse.findUnique({
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
      message:"failed to create Response",
      res,
      statusCode:500,
      success:false,
      data:''
    })
  }
}
const getRfiByProjectId=async(req,res)=>{
  const{projectId}=req.params
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
    const getRFI= await prisma.rFI.findMany({
      where:{project_id:projectId},
      include:{
        fabricator:true,
        project:true,
        recepients:true,
        sender:true,
        rfiresponse:true,
      }
    })
    //console.log("RFI fetched by ProjectId",getRFI)
    
    return sendResponse({
      message:"RFI fetched by ProjectId",
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
export { 
  addRFI, 
  updateRFI,
  sentRFIByUser, 
  Inbox, 
  RFIseen, 
  RFIByID,
  
  viewRFIfiles,
  viewRFIResponsefiles,

  addRFIResponse,
  getRfiresponse,

  getRfiByProjectId
};
