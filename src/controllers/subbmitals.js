import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { sendEmail } from "../../service/gmailservice/index.js";
import path from "path"
import mime from "mime"
import fs from "fs"
import { sendNotification } from "../utils/notify.js";

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
      path: `/public/submittalstemp/${file?.filename}`, // Relative path
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
      },
    });

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Project Station - Submittal Notification</title>
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
        font-size: 20px;n
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
            <span>You’ve Received a New Submittal</span><br/>
            <span><strong>Project:</strong> ${submitals.project?.name}</span>
        </div>
        <div> 
            <img 
                src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9"
                alt="Company Logo" 
                style="max-width: 100px;" />
        </div>
    </div>
        <div class="email-body">
            <h2>Welcome to Project Station, <b>${submitals.recepients?.username}</b>!</h2>
            <p>You have received a new Submittal notification. Here are the details:</p>

            <p><strong>Project Name:</strong> ${submitals.project?.name}</p>
            <p><strong>Sender:</strong> ${submitals.sender?.username}</p>
            <p><strong>Date:</strong> ${submitals.date}</p>
            <p><strong>Subject:</strong> ${submitals.subject}</p>
            <p>You can check your Submittal by clicking the link <a href="projectstation.whiteboardtec.com">here</a>.</p>

            <div class="card">
                <div class="card-body">
                    ${description}
                </div>
            </div>

            <p>Thanks & Regards,</p>
            <p><b>${submitals.sender?.username}</b></p>
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
      to: submitals.recepients.email, // Ensure it's `recipient`, not `recepients`
      subject: subject,
      text: description,
    });
  

    // // Emit real-time notification using socket.io
    sendNotification(recepient_id,{
      message:`New Submittal received: ${subject}`,
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
  const { id } = req.params; // submittal ID
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
  } = req.body;

  try {
    // check if submittal exists
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

    // update file details if files are uploaded
    const fileDetails = req.files
      ? req.files.map((file) => ({
          filename: file.filename,
          originalName: file.originalname,
          id: file.filename.split(".")[0],
          path: `/public/submittals/${file.filename}`,
        }))
      : existing.files; // keep existing files if none uploaded

    // update the submittal
    const updated = await prisma.submittals.update({
      where: { id },
      data: {
        fabricator_id: fabricator_id ?? existing.fabricator_id,
        project_id: project_id ?? existing.project_id,
        recepient_id: recepient_id ?? existing.recepient_id,
        sender_id: sender_id ?? existing.sender_id,
        status: typeof status === "boolean" ? status : existing.status,
        stage: stage ?? existing.stage,
        subject: subject ?? existing.subject,
        description: description ?? existing.description,
        isAproovedByAdmin:
          typeof isAproovedByAdmin === "boolean"
            ? isAproovedByAdmin
            : existing.isAproovedByAdmin,
        files: fileDetails,
      },
    });

    return sendResponse({
      message: "Submittal updated successfully",
      res,
      statusCode: 200,
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("Error updating submittal:", error.message);
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
        project: true,
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
        project: true,
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
      where: { id },
    });

    if (!submittals) {
      return res.status(404).json({ message: "submittals not found" });
    }

    const fileObject = submittals.files.find((file) => file.id === fid);

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

const submitalsResponseViewFiles = async (req, res) => {
  const { id, fid } = req.params;

  try {
    const submittals = await prisma.submittalsdResponse.findUnique({
      where: { id },
    });

    if (!submittals) {
      return res.status(404).json({ message: "submittalsResponse not found" });
    }

    const fileObject = submittals.files.find((file) => file.id === fid);

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
    path: `/public/submittalsResponsetemp/${file.filename}`, // Relative path
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
