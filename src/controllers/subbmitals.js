import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { sendEmail } from "../../service/gmailservice/index.js";

const AddSubmitals = async (req, res) => {
  const { id } = req?.user;
  const { fabricator_id, project_id, recepient_id, subject, description } =
    req.body;

  console.log(fabricator_id, project_id, recepient_id, subject, description);

  try {
    if (
      !fabricator_id ||
      !project_id ||
      !recepient_id ||
      !subject ||
      !description
    ) {
      console.log("Fields are empty");
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
      path: `/public/submittalstemp/${file.filename}`, // Relative path
    }));

    const submitals = await prisma.submittals.create({
      data: {
        description,
        subject,
        fabricator_id,
        files: fileDetails,
        project_id,
        recepient_id,
        sender_id: id,
        status: true,
      },
      include: {
        recepients: true,
      },
    });

    const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
          }
          h1 {
            color: #5b6e7d;
          }
          .content {
            margin-top: 20px;
          }
          .description {
            font-size: 16px;
            color: #666;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Notification</h1>
          <div class="content">
            <p class="description">
              ${description}
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

    sendEmail({
      html: htmlContent,
      to: submitals.recepients.email,
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

    // Emit real-time notification using socket.io
    if (global.io) {
      global.io.to(recepient_id).emit("newNotification", {
        message: `New RFI received: ${subject}`,
        rfiId: newrfi.id,
      });
    }

    return sendResponse({
      message: "Submittals success",
      res,
      statusCode: 200,
      success: true,
      data: submitals,
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
    // Emit real-time notification using socket.io
    if (global.io) {
      global.io.to(recepient_id).emit("newNotification", {
        message: `New submittal received: ${subject}`,
        submittalId: submittals.id,
      });
    }

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

const SubmittalsSeen = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    console.log("Invalid ID");
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

export { AddSubmitals, RecievedSubmittals, SentSubmittals, SubmittalsSeen };
