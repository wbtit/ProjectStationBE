import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { sendEmail } from "../../service/gmailservice/index.js";

const addRFI = async (req, res) => {
  const { id } = req.user;
  console.log("==", req.body);
  const { fabricator_id, project_id, recipient_id, subject, description } =
    req.body;

  if (req.files.length > 0) {
    files.map((file) => console.log(file));
  }

  try {
    if (
      !fabricator_id ||
      !project_id ||
      !recipient_id ||
      !subject ||
      !description
    ) {
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
      path: `/public/rfitemp/${file.filename}`, // Relative path
    }));

    const newrfi = await prisma.rFI.create({
      data: {
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
      global.io.to(recipient_id).emit("newNotification", {
        message: `New RFI received: ${subject}`,
        rfiId: newrfi.id,
      });
    }

    return sendResponse({
      message: "RFI added successfully",
      res,
      statusCode: 200,
      success: true,
      data: newrfi,
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
        recepients : true
      }
    });

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

  console.log(id, "This is rfi ID")

  try {
    const rfi = await prisma.rFI.findUnique({
      where: {
        id,
      },
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
      },
    });

    console.log(rfi, "This is rfi")

    sendResponse({
      message: "RFI fetch success",
      res,
      statusCode: 200,
      success: true,
      data: rfi,
    });
  } catch (error) {
    console.log(error.message);
    sendResponse({
      message: error.message,
      res,
      statusCode: 200,
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
        recepients : true
      }
    });

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

export { addRFI, sentRFIByUser, Inbox, RFIseen, RFIByID };
