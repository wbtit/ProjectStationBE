import prisma from "../lib/prisma";
import { sendResponse } from "../utils/responder";

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

    const submitals = await prisma.submittals.create({
      data: {
        description,
        subject,
        fabricator_id: fabricator,
      },
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
