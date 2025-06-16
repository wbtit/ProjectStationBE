// Please navigate to very bottom of the file to know the logics in this file.

import prisma from "../lib/prisma.js";
import { isValidUUID } from "../utils/isValiduuid.js";
import { sendResponse } from "../utils/responder.js";
import { sendNotification } from "../utils/notify.js";

const addComment = async (req, res) => {
  const { task_id } = req.params;
  const { comment } = req.body;
  const { id } = req.user;
  // console.log(req.body);

  if (!comment || !task_id) {
    return sendResponse({
      message: "Fields are Emptys!",
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

    // // Extract file details (uuid, originalName, path)
    // const fileDetails = req.files.map((file) => ({
    //   filename: file.filename, // UUID + extension
    //   originalName: file.originalname, // Original name of the file
    //   id: file.filename.split(".")[0], // Extract UUID from the filename
    //   path: `/public/commenttemp/${file.filename}`, // Relative path
    // }));
    const newComment = await prisma.comment.create({
      data: {
        data: comment,
        task_id,
        user_id: id,
      },
    });
    const task = await prisma.task.findUnique({
      where:{id:task_id},
      include:{
        project:{
          select:{
            managerID:true
          }
        },
        user:true,
        user_id:true                  
      }
    })
   const managerID = task?.project?.managerID;
   const taskName = task?.name || "Unnamed Task";
   const userName = task?.user?.f_name || "Someone";
   const employer= task?.user_id
if (managerID && id !== managerID) {
  sendNotification(managerID, {
    message: `Comment added in "${taskName}" by ${userName}`,
  });
}

if (employer && id === managerID && employer !== managerID) {
  sendNotification(employer, {
    message: `Comment added in "${taskName}" by Project Manager`,
  });
}

    return sendResponse({
      message: "comment Added Successfully",
      res,
      statusCode: 200,
      data: newComment,
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
  } finally {
    prisma.$disconnect();
  }
};


export { addComment};
