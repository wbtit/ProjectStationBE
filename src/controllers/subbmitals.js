import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";

const AddSubmitals = async (req, res) => {
  const { id } = req?.user;
  const { fabricator, project, recipient, subject, description } = req.body;

  try {
    if (!fabricator || !project || !recipient || !subject || !description) {
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
        fabricator_id: fabricator,
        files: fileDetails,
        project_id: project,
        recepient_id: recipient, // Make sure this matches your DB field
        sender_id: id,
        status: true,
      },
      include: {
        recipient: true, // Make sure this matches your Prisma schema
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
      to: submitals.recipient.email, // Ensure it's `recipient`, not `recepients`
      subject: subject,
      text: description,
    });

    const notification = await prisma.notification.create({
      data: {
        userID: recipient, // Notify the recipient instead of sender
        subject: subject,
        isRead: false,
      },
    });

    if (!notification) {
      return sendResponse({
        message: "Failed to add the notification",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }

    // Emit real-time notification using socket.io
    if (global.io) {
      global.io.to(recipient).emit("newNotification", {
        message: `New submittal received: ${subject}`,
        submittalId: submitals.id,
      });
    }

    return sendResponse({
      message: "Submittals added successfully",
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
