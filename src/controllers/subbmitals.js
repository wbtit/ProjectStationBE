import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { sendEmail } from "../../service/gmailservice/index.js";
import path from "path"
import mime from "mime"
import fs from "fs"
import { sendNotification } from "../utils/notify.js";

import { fileURLToPath } from "url";

// Recreate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Create Change Order function
const createSubmittal=async(req,res,approval)=>{
  const{id}=req.user
  const{description,subject,fabricator_id,project_id,recepient_id}=req.body
try {
    if (!project_id || !recepient_id || !subject || !description) {
      // console.log("Fields are empty");
      return sendResponse({
        message: "Fields are empty",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    // Extract file details (uuid, originalName, path)
    const fileDetails = req.files.map((file) => ({
      filename: file.filename, // UUID + extension
      originalName: file.originalname, // Original name of the file
      id: file.filename.split(".")[0], // Extract UUID from the filename
      path: `submittalstemp/${file?.filename}`, // Relative path
    }));

    const submitals = await prisma.submittals.create({
      data: {
        description,
        subject,
        fabricator_id:
          fabricator_id,
        files: fileDetails,
        project_id,
        recepient_id,
        sender_id: id,
        isAproovedByAdmin:approval,
        status: true,
      },
      include: {
        recepients: true, // Make sure this matches your Prisma schema
        project:true,
        sender:true
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
                ${submitals.project.name || "N/A"}
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
                  Date: ${submitals?.date || new
                  Date().toLocaleDateString()}
                </p>

                <p
                  style="
                    margin: 15px 0;
                    font-size: 16px;
                    font-weight: bold;
                    color: #333333;
                  "
                >
                  Subject:  ${submitals.subject}
                </p>

                <p
                  style="
                    margin: 20px 0;
                    font-size: 15px;
                    color: #333333;
                    line-height: 24px;
                  "
                >
                  Dear ${submitals?.recepients?.f_name || "Sir/Ma'am"},
                </p>

                <p
                  style="
                    margin: 10px 0 25px 0;
                    font-size: 15px;
                    color: #333333;
                    line-height: 24px;
                  "
                >
                  ${submitals?.description || "No description provided."}
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
                        ${[submitals?.sender?.f_name, submitals?.sender?.m_name,
                            submitals?.sender?.l_name].filter(Boolean).join(" ")}
                      </p>
                      <p style="margin: 2px 0; font-size: 14px; color: #888888">
                        ${submitals?.sender?.designation || "N/A"}
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
      to: submitals.recepients.email, // Ensure it's `recipient`, not `recepients`
      subject: subject,
      text: description,
    });
  

    // // Emit real-time notification using socket.io
    sendNotification(recepient_id,{
      message:`New Submittal received: ${submitals.subject}`,
      submittlId:submitals.id
    })

    return sendResponse({
      message: "Submittals added successfully",
      res,
      statusCode: 200,
      success: true,
      data: submitals,
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
}




const AddSubmitals = async (req, res) => {
try {
  const {  is_superuser,is_manager,is_staff } = req.user
  
      if (is_superuser ||(is_manager&& is_staff)) {
        return createSubmittal(req, res,true);
      }else{
        return createSubmittal(req,res,false)
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

// updateSubmittal.ts
const updateSubmittal = async (req, res) => {
  const { id } = req.params;

  const {
    fabricator_id,
    project_id,
    recepient_id,
    sender_id,
    status,
    stage,
    subject,
    description,
    isAproovedByAdmin,
    isDeputyManagerAprooved,
    isDeptManagerAprooved,
  } = req.body;
const toBoolean = (value) => {
  if (value === true || value === "true") return true;
  if (value === false || value === "false") return false;
  return undefined;
};

  try {
    // 1. Check existence
    const existing = await prisma.submittals.findUnique({
      where: { id },
    });

 

    if (!existing) {
      return sendResponse({
        message: "Submittal not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    // 2. Handle files (keep existing if none uploaded)
    const fileDetails =
      req.files && req.files.length > 0
        ? req.files.map((file) => ({
            id: file.filename.split(".")[0],
            filename: file.filename,
            originalName: file.originalname,
            path: `public/submittals/${file.filename}`,
          }))
        : existing.files;

    // 3. Build update payload (BOOLEAN SAFE)
    const updateData = {
      fabricator_id: fabricator_id ?? existing.fabricator_id,
      project_id: project_id ?? existing.project_id,
      recepient_id: recepient_id ?? existing.recepient_id,
      sender_id: sender_id ?? existing.sender_id,
      stage: stage ?? existing.stage,
      subject: subject ?? existing.subject,
      description: description ?? existing.description,
      status: toBoolean(status) ?? existing.status,
      isAproovedByAdmin:
        toBoolean(isAproovedByAdmin) ?? existing.isAproovedByAdmin,
      isDeputyManagerAprooved:
        toBoolean(isDeputyManagerAprooved) ??
        existing.isDeputyManagerAprooved,
      isDeptManagerAprooved:
        toBoolean(isDeptManagerAprooved) ??
        existing.isDeptManagerAprooved,
      files: fileDetails,
    };

  
    // 4. Update
    const updated = await prisma.submittals.update({
      where: { id },
      data: updateData,
    });



    return sendResponse({
      message: "Submittal updated successfully",
      res,
      statusCode: 200,
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error(" Error updating submittal:", error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};



const getSubmittal = async (req, res) => {
  const { submittalId } = req.params;
  //console.log("submittalId:", submittalId);

  try {
    if (!submittalId) {
      return sendResponse({
        message: "SubmittalId is required",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    const submittal = await prisma.submittals.findUnique({
      where: { id: submittalId },
      include: {
        project:{select:{name:true}},
        sender: {
          include: { 
            fabricator: true },
        },
        submittalsResponse:true,
        file:true
      },
    });

    if (!submittal) {
      return sendResponse({
        message: "Submittal not found",
        res,
        statusCode: 404,
        success: false,
        data: null,
      });
    }

    return sendResponse({
      message: "Submittal fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: submittal,
    });
  } catch (error) {
    console.error("Error fetching submittal:", error.message);
    return sendResponse({
      message: "Failed to fetch the submittal",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};


const SentSubmittals = async (req, res) => {
  const { id } = req.user;
  //console.log("UserId:",id)
  try {
    const submittals = await prisma.submittals.findMany({
      where: {
        sender_id: id,
      },
      include: {
        fabricator: true,
        project:{select:{name:true}},
        recepients: true,
        sender: true,
        submittalsResponse:true,
        file:true
      },
    });
    //console.log("sent submittals:",submittals)
    return sendResponse({
      message: "Retrived all sent submittals",
      res,
      statusCode: 200,
      success: true,
      data: submittals,
    });
  } catch (error) {
    console.log(error.message);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};

const RecievedSubmittals = async (req, res) => {
  const { id } = req.user;

  try {
    const submittals = await prisma.submittals.findMany({
      where: {
        recepient_id: id,
      },
      include: {
        fabricator: true,
        project:{select:{name:true}},
        recepients: true,
        sender: true,
        submittalsResponse:true,
        file:true
      },
    });

    return sendResponse({
      message: "Retrived all recieved submittals",
      res,
      statusCode: 200,
      success: true,
      data: submittals,
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

const SubmittalsSeen = async (req, res) => {
  const { id } = req.params;
  const{status}=req.body
  if (!id) {
    // console.log("Invalid ID");
    return sendResponse({
      message: "Invalid ID",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const submittals = await prisma.submittals.update({
      where: {
        id,
      },
      data: {
        status:status,
      },
      include:{
        project:{select:{name:true}},
        submittalsResponse:true
      }
    });

    return sendResponse({
      message: "Submittals seen",
      res,
      statusCode: 200,
      success: true,
      data: submittals,
    });
  } catch (error) {
     console.log(error.message);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};


const submitalsViewFiles = async (req, res) => {
  const { id, fid } = req.params;

  try {
    const submittals = await prisma.submittals.findUnique({
      where: { id: id }, // adjust if your ID is not numeric
    
    });

    if (!submittals) {
      return res.status(404).json({ message: "Submittals not found" });
    }

    const fileObject = submittals.files.find((file) => file.id === fid);
    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

   // 3. Construct safe absolute path
       const projectRoot =
         process.env.PUBLIC_DIR || path.join(__dirname, "..", "..", "public");

   const safePath = path.join(projectRoot, fileObject.path);
    if (!fs.existsSync(safePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    const fileExt = path.extname(safePath).toLowerCase();
    const mimeType = mime.getType(safePath) || 'application/octet-stream';

    if (fileExt === '.zip') {
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

const submitalsResponseViewFiles = async (req, res) => {
  const { id, fid } = req.params;

  try {
    const submittalsResponse = await prisma.submittalsResponse.findUnique({
      where: { id },
    
    });

    if (!submittalsResponse) {
      return res.status(404).json({ message: "submittalsResponse not found" });
    }

    const fileObject = submittalsResponse.files.find(file => file.id === fid);

    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

    // 3. Construct safe absolute path
       const projectRoot =
         process.env.PUBLIC_DIR || path.join(__dirname, "..", "..", "public");
   const safePath = path.join(projectRoot, fileObject.path);
    if (!fs.existsSync(safePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    const fileExt = path.extname(safePath).toLowerCase();
    const mimeType = mime.getType(safePath) || 'application/octet-stream';

    if (fileExt === '.zip') {
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

    const fileStream = fs.createReadStream(safePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error("View File Error:", error);
    return res.status(500).json({
      message: "Something went wrong while viewing the file",
      error: error.message,
    });
  }
};


const addSubmittalsResponse=async(req,res)=>{
const{submittalId}=req.params
const{id}=req.user
const{reason,respondedAt,status,description,parentResponseId}=req.body

// console.log("submittalId:",submittalId)
// console.log("Req Body:",req.body)


try {
  if(!description){
    return sendResponse({
      message:"Feilds are empty",
      res,
      statusCode:400,
      success:false,
      data:null
    })
  }
  
  const subStatus= await prisma.submittals.update({
    where:{
      id:submittalId
    },data:{
      status:false
    }
  })
  if (!subStatus) {
    return sendResponse({
      message: "Failed to update the Status of the RFI to false",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }

  if(parentResponseId!=undefined){
    const parentResponse= await prisma.submittalsResponse.update({
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
    path: `submittalsResponsetemp/${file.filename}`, // Relative path
  }));

  // console.log("File deatiles in Submittals:",fileDetails)
  const addresponse= await prisma.submittalsResponse.create({
    data:{
     reason:reason || "",
     description:description,
     userId:id,
     files:fileDetails,
     submittalsId:submittalId ,
     parentResponseId:parentResponseId||null
    }
  })
const submittal= await prisma.submittals.findUnique({
  where:{id:submittalId}
})
if(!submittal){
  return sendResponse({
    message:"Submittal not found",
    res,
    statusCode:404,
    success:false,
    data:null
  })
}
if(req.user.id !== submittal.sender_id){
    // Notify original sender of the ChangeOrder
    await sendNotification(submittal.sender_id, {
      message: `New response on your submittal: ${submittal.remarks}`,
      coId: submittal.id,
    });
  }else{
    await sendNotification(submittal.recepient_id, {
      message: `New response on Submittal you received: ${submittal.remarks}`,
      coId: submittal.id,
    });
  }
  //console.log(addresponse)
  return sendResponse({
    message:"Response created",
    res,
    statusCode:200,
    success:true,
    data:addresponse
  })
  
} catch (error) {
  console.log("Error message:",error.message)
    return sendResponse({
      message:"failed to create Response",
      res,
      statusCode:500,
      success:false,
      data:''
    })
}
}
const getSubmittalresponse=async(req,res)=>{
  const{id}=req.params
  // console.log("submittalsId:",id)
  try {
    const response= await prisma.submittalsResponse.findUnique({
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
    // console.log("ResponseData created:",response)


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
const getSubmittalsByProjectId=async(req,res)=>{
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
    const getRFI= await prisma.submittals.findMany({
      where:{project_id:projectId},
      include:{
        fabricator:true,
        project:true,
        recepients:true,
        sender:true,
        submittalsResponse:true
      }
    })
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
  AddSubmitals,
  updateSubmittal,
  RecievedSubmittals,
  SentSubmittals, 
  SubmittalsSeen,
  submitalsViewFiles,

  addSubmittalsResponse,
  getSubmittalresponse,
  
  submitalsResponseViewFiles,
  getSubmittal,
  getSubmittalsByProjectId
};
 