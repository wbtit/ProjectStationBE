// Please navigate to very bottom of the file to know the logics in this file.

import prisma from "../lib/prisma.js";
import { isValidUUID } from "../utils/isValiduuid.js";
import { sendResponse } from "../utils/responder.js";

const addComment = async (req, res) => {
  const { task_id } = req.params;
    const { data, user_id } = req.body;
    const { id } = req.user

  if (!data || !task_id ) {
    return sendResponse({
      message: "Fields are Empty!",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }
  try {
    if (!req.user) {
      return sendResponse({
        message: "User not authenticated",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }

    // Extract file details (uuid, originalName, path)
    const fileDetails = req.files.map((file) => ({
      filename: file.filename, // UUID + extension
      originalName: file.originalname, // Original name of the file
      id: file.filename.split(".")[0], // Extract UUID from the filename
      path: `/public/commenttemp/${file.filename}`, // Relative path
    }));
    const newComment = await prisma.comment.create({
      data: {
        data,
        file: fileDetails,
        task_id,
        user_id : id,
      },
    });
    return sendResponse({
      message: "comment Added Successfully",
      res,
      statusCode: 200,
      data: newComment,
    });
  } catch (error) {
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  } finally {
    prisma.$disconnect();
  }
};
const getCommentById = async (req, res) => {
  const { id } = req?.params;
  try {
    if (!req.user) {
      return sendResponse({
        message: "User not authenticated",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }
    if (!id) {
      return sendResponse({
        message: "Invalid task ID",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    if (!isValidUUID) {
      return sendResponse({
        message: "Invalid task UUid",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    const comment = await prisma.comment.findUnique({
      where: {
        id,
      },
    });
    if (!comment) {
      return sendResponse({
        message: "error in fetching comment by id",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "Task by id fetched successfully",
      res,
      statusCode: 200,
      success: true,
      data: comment,
    });
  } catch (error) {
    return sendResponse({
      message: "Error in fetching task by id",
      res,
      statusCode: 500,
    });
  } finally {
    prisma.$disconnect();
  }
};
const updateCommentByID = async (req, res) => {
  const { id } = req?.params;
  try {
    if (!req.user) {
      return sendResponse({
        message: "User not authenticated",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }
    if (!isValidUUID) {
      return sendResponse({
        message: "Invalid task UUid",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    const comment = await prisma.comment.update({
      where: {
        id,
      },
      data: req.body,
    });
    if (!comment) {
      return sendResponse({
        message: "error in updating task by id",
        res,
        statusCode: 403,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "TaskbyID updated successfully",
      res,
      statusCode: 200,
      success: true,
      data: comment,
    });
  } catch (error) {
    return sendResponse({
      message: "Error in fetching tasks",
      res,
      statusCode: 500,
    });
  } finally {
    prisma.$disconnect();
  }
};

export { addComment, getCommentById, updateCommentByID };
