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
        recepient_id: recipient,
        sender_id: id,
        status: true,
      },
    });

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
