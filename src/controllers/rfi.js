import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { sendEmail } from "../../service/gmailservice/index.js";
import path from "path"
import fs from "fs"
import mime from "mime"
import { sendNotification } from "../utils/notify.js";


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
      path: `public/rfitemp/${file.filename}`, // Relative path
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
        
      },
      include: {
        recepients: true,
        project: true,
        sender : true,
        rfiresponse:true
      },
    });

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Project Station - RFI Notification</title>
    <style>
      body {
        font-family: 'Courier New', Courier, monospace;
        background-color: #f2fdf3; /* Light greenish background */
        color: #333;
        margin: 0;
        padding: 0;
      }

      .email-container {
        background-color: #ffffff;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        border-radius: 10px;
        padding: 35px;
        margin-top: 50px;
        max-width: 650px;
        margin-left: auto;
        margin-right: auto;
      }

      .email-header {
        background-color: #6adb45;
        color: white;
        padding: 25px;
        border-radius: 8px;
        text-align: center;
      }

      .email-header .title {
        font-size: 26px;
        font-weight: bold;
        margin: 0;
      }

      .email-body {
        margin-top: 25px;
        text-align: left;
        line-height: 1.6;
      }

      .card {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 25px;
        margin-top: 30px;
        border: none;
      }

      .footer {
        text-align: center;
        margin-top: 40px;
        font-size: 14px;
        color: #555;
      }

      .footer img {
        max-width: 150px;
        margin-top: 15px;
      }

      a {
        color: #6adb45;
        text-decoration: none;
        font-weight: bold;
      }

      .green-text {
        color: #6adb45;
      }

      h2 {
        font-size: 20px;
        color: #333;
        margin-top: 20px;
      }

      p {
        font-size: 16px;
        color: #555;
      }

      /* Ensure logo is centered in footer */
      .footer {
        text-align: center;
        margin-top: 40px;
      }

      .footer img {
        max-width: 150px;
        display: block;
        margin-left: auto;
        margin-right: auto;
      }

      /* Ensure the email container is centered */
      .email-container {
        text-align: center;
      }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="d-flex justify-content-between align-items-center">
        <div class="title">
            <span>You’ve Received a New RFI</span><br/>
            <span><strong>Project:</strong> ${newrfi.project.name}</span>
        </div>
        <div> 
            <img 
                src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9"
                alt="Company Logo" 
                style="max-width: 100px;" />
        </div>
    </div>
        <div class="email-body">
            <h2>Welcome to Project Station, <b>${newrfi.recepients.username}</b>!</h2>
            <p>You have received a new RFI notification. Here are the details:</p>

            <p><strong>Project Name:</strong> ${newrfi.project.name}</p>
            <p><strong>Sender:</strong> ${newrfi.sender.username}</p>
            <p><strong>Date:</strong> ${newrfi.date}</p>
            <p><strong>Subject:</strong> ${newrfi.subject}</p>
            <p>You can check your RFI by clicking the link <a href="projectstation.whiteboardtec.com">here</a>.</p>

            <div class="card">
                <div class="card-body">
                    ${description}
                </div>
            </div>

            <p>Thanks & Regards,</p>
            <p><b> ${newrfi.sender.username}</b></p>
            <p>Bangalore</p>
        </div>

        <div class="footer">
            <img
                src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9"
                alt="Company Logo"
            />
            <p><b>Whiteboard Technologies Pvt. Ltd.</b></p>
            <p>Bangalore</p>
        </div>
    </div>
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
      message:`New RFI received :${subject}`,
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
    // console.log(error);
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
// Update RFI Handler
const updateRFI = async (req, res) => {
  const { id } = req.params; // RFI ID
  const {
    subject,
    description,
    status,
    isAproovedByAdmin,
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
    // 1. Fetch RFI record
    const rfi = await prisma.rFI.findUnique({
      where: { id },
    });

    if (!rfi || !rfi.files) {
      return res.status(404).json({ message: "RFI or files not found" });
    }

    // 2. Find requested file object
    const fileObject = rfi.files.find((file) => file.id === fid);
    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

    console.log("File object:", fileObject);

    // 3. Construct safe absolute path
   const projectRoot = process.cwd();
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
const viewRFIResponsefiles = async (req, res) => {
  const { id, fid } = req.params;

  try {
    const rfiResponse = await prisma.rFIResponse.findUnique({
      where: { id: id }, // Adjust based on your schema
     
    });

    if (!rfiResponse) {
      return res.status(404).json({ message: "RFI Response not found" });
    }

    const fileObject = rfiResponse.files.find((file) => file.id === fid);

    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

     // 3. Construct safe absolute path
   const projectRoot = process.cwd();
   const safePath = path.join(projectRoot, fileObject.path);

    if (!fs.existsSync(safePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    const fileExt = path.extname(safePath).toLowerCase();
    const mimeType = mime.getType(safePath) || 'application/octet-stream';

    if (fileExt === '.zip') {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileObject.originalName}"`
      );
    } else {
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
      path: `public/rfiResponsetemp/${file.filename}`, // Relative path
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
