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
  } = req.body;

  if (
    !project ||
    !recipients ||
    !remarks ||
    !changeOrder ||
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

  try {
    const fileDetails = req.files.map((file) => ({
      filename: file.filename, // UUID + extension
      originalName: file.originalname, // Original name of the file
      id: file.filename.split(".")[0], // Extract UUID from the filename
      path: `/public/rfiResponsetemp/${file.filename}`, // Relative path
    }));
    
    const changeorder = await prisma.changeOrder.create({
      data: {
        changeOrder: parseInt(changeOrder),
        description: description,
        project: project,
        recipients: recipients,
        remarks: remarks,
        sender: req.user.id,
        files:fileDetails
        
      },
    });
    //console.log("ChangeOrder from DB:",changeorder)
    
    //RLT 
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

const  addCoResponse=async(req,res)=>{

  const {coId}=req.params
  const {id}=req.user
  const {approved,description}=req.body
  
  try {
    if(!coId || !approved ||!description){
      return sendResponse({
        message:"feilds are required",
        res,
        statusCode: 400,
        success: false,
        data: null,  
      })
    }
    const coResponse= await prisma.coResponse.create({
      data:{
        approved:approved,
        description:description,
        userId:id,
        coId:coId
      }
    })

    return sendResponse({
      message:"Coresponse created successfully",
      res,
      statusCode:200,
      success:true,
      data:coResponse
    })

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
}
const getResponse=async(req,res)=>{
  const{id}=req.params
  try {
    
    const response= await prisma.coResponse.findUnique({
      where:{id:id}
    })
    return sendResponse({
      message:"Respose is fetched successfully",
      res,
      statusCode:200,
      success:true,
      data:response
    })
  } catch (error) {
    console.log(error.message)
    return sendResponse({
      message:"Failed to fetch responses",
      res,
      statusCode:500,
      success:false,
      data:null
    })
  }
}

const AddChangeOrdertable=async(req,res)=>{
const{coId}=req.params
const{siNO,description,referenceDoc,elements,QtyNo,hours,cost}=req.body

try {
  if(!req.body){
    return sendResponse({
      message:"Feilds are empty",
      res,
      statusCode:400,
      success:false,
      data:null
    })
  }
  
  const createTable= await prisma.changeOrdertable.createMany({
    data:Object.values(req.body).map((co)=>({
      siNO:co.siNO,
      description:co.description,
      referenceDoc:co.referenceDoc,
      elements:co.elements,
      QtyNo:co.QtyNo,
      hours:co.hours,
      cost:co.cost
    }))
  })

  return sendResponse({
    message:"Co Table created",
    res,
    statusCode:200,
    success:true,
    data:createTable
  })
  
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
}

const getRowCotable=async(req,res)=>{
  const{coRowId}=req.params
  try {
    if(!coRowId){
      return sendResponse({
        message:"Feilds are empty",
        res,
        statusCode:400,
        success:false,
        data:null
      }) 
    }
    const coRow= await prisma.changeOrdertable.findMany({
      where:{id:coRowId}
    })
    return sendResponse({
      message:"Response created",
      res,
      statusCode:200,
      success:true,
      data:coRow
    })
  } catch (error) {
    console.log(error.message)
    return sendResponse({
      message:"failed to fetch the CoRow",
      res,
      statusCode:500,
      success:false,
      data:''
    })
  }
}

export { 
  AddChangeOrder ,
  changeOrderReceived,
  changeOrderSent,
  addCoResponse,
  getResponse,
  AddChangeOrdertable,
  getRowCotable
};
