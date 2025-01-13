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


export { AddSubmitals}