import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";


const changeOrderReceived=async(req,res)=>{
    const {id}=req.user

    try{
        if(!id){
            return sendResponse({
                message:"Invalid userId",
                res,
                statusCode:411,
                success:false,
                data:null
            })
        }
        const receives= await prisma.changeOrder.findMany({
            where:{
                recipients:id
            },
            select:{
                remarks:true,
                description:true,
                changeOrder:true
            }
        })
    }
}
const AddChangeOrder = async (req, res) => {
  const {
    project,
    recipients,
    sender,
    remarks,
    changeOrder,
    description,
    rows,
  } = req.body;

  if (
    !project ||
    !recipients ||
    !sender ||
    !remarks ||
    !changeOrder ||
    !description ||
    !rows
  ) {
    return sendResponse({
      message: "Fields are empty",
      res,
      statusCode: 400,
      success: false,
      data: null,
    });
  }

  try {
    const fileDetails = req.files.map((file) => ({
      filename: file.filename, // UUID + extension
      originalName: file.originalname, // Original name of the file
      id: file.filename.split(".")[0], // Extract UUID from the filename
      path: `/public/rfitemp/${file.filename}`, // Relative path
    }));

    const changeOrder = await prisma.changeOrder.create({
      data: {
        changeOrder: changeOrder,
        description: description,
        project: project,
        recipients: recipients,
        remarks: remarks,
        rows: rows,
        sender: req.user.id,
        files: fileDetails,
      },
    });

    return sendResponse({
      message: "Change Order Submitted",
      res,
      statusCode: 200,
      success: true,
      data: changeOrder,
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

export { AddChangeOrder };
