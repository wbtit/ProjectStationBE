import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { sendEmail } from "../../service/gmailservice/index.js";
import path from "path"
import mime from "mime"
import fs from "fs"
import { sendNotification } from "../utils/notify.js";

const AddSubmitals = async (req, res) => {
  const { id, fabricatorId } = req?.user;
  const { fabricator_id, project_id, recepient_id, subject, description } =
    req.body;

  // console.log(fabricator_id, project_id, recepient_id, subject, description);

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
          fabricator_id !== "undefined" ? fabricator_id : fabricatorId,
        files: fileDetails,
        project_id,
        recepient_id,
        sender_id: id,
        status: true,
      },
      include: {
        recipient: true, // Make sure this matches your Prisma schema
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
      to: submitals.recipient.email, // Ensure it's `recipient`, not `recepients`
      subject: subject,
      text: description,
    });
    const notification = await prisma.notification.create({
      data: {
        userID: id,
        subject: subject,
        isRead: false,
      },
    });
    if (!notification) {
      return sendResponse({
        message: "Failed to add the notifications",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

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
};



const SentSubmittals = async (req, res) => {
  const { id } = req.user;

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
      },
    });

    return sendResponse({
      message: "Retrived all sent submittals",
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
        status: false,
      },
    });

    return sendResponse({
      message: "Submittals seen",
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

export { AddSubmitals, RecievedSubmittals, SentSubmittals, SubmittalsSeen,submitalsViewFiles };
