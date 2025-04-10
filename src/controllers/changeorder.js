import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { sendNotification } from "../utils/notify.js";


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
                changeOrder:true,
                sentOn:true
                
            }
        })
        if(receives.length===0){
            return sendResponse({
                message:"No changeOrder for this user",
                res,
                statusCode:201,
                success:true,
                data:receives
            })
        }
        return sendResponse({
            message:"Fetched all recived ChangeOrder for this user",
            res,
            statusCode:200,
            success:true,
            data:receives
        })
    }catch(error){
        return sendResponse({
            message:error.message,
            res,
            statusCode:500,
            data:null,
            success:false
        })
    }
}
const changeOrderSent=async(req,res)=>{
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
        const sents= await prisma.changeOrder.findMany({
            where:{
                sender:id
            },
            select:{
                remarks:true,
                description:true,
                changeOrder:true,
                sentOn:true
                
            }
        })
        if(receives.length===0){
            return sendResponse({
                message:"No sents changeOrders for this user",
                res,
                statusCode:201,
                success:true,
                data:sents
            })
        }
        return sendResponse({
            message:"Fetched all sent ChangeOrders for this user",
            res,
            statusCode:200,
            success:true,
            data:sents
        })
    }catch(error){
        return sendResponse({
            message:error.message,
            res,
            statusCode:500,
            data:null,
            success:false
        })
    }
}
const AddChangeOrder = async (req, res) => {
  const {
    project,
    recipients,
    remarks,
    changeOrder,
    description,
    rows,
  } = req.body;
  // console.log(req.body)


  if (
    !project ||
    !recipients ||
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

    const changeorder = await prisma.changeOrder.create({
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
    //RLT notifications
    sendNotification(recipients,{
      message:`New CO received: ${remarks}`,
      coId:changeorder.id
    })
    return sendResponse({
      message: "Change Order Submitted",
      res,
      statusCode: 200,
      success: true,
      data: changeorder,
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

export { AddChangeOrder ,changeOrderReceived,changeOrderSent};
