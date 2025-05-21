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
                sentOn:true,
                files:true,
                project:true,
                recipients:true
                
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
                sentOn:true,
                files:true,
                recipients:true,
                project:true
                
                
            }
        })
        if(sents.length===0){
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
      path: `/public/changeordertemp/${file.filename}`, // Relative path
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
    
    const response= await prisma.cOResponse.findUnique({
      where:{id:id},
      include:{
        file:true
      }
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

const AddChangeOrdertable = async (req, res) => {
  const { coId } = req.params;
  const changeOrderItems = Object.values(req.body);

  console.log("ChangeOrderTable data:", changeOrderItems);

  try {
    if (!Array.isArray(changeOrderItems) || changeOrderItems.length === 0) {
      return sendResponse({
        message: "Fields are empty or invalid format",
        res,
        statusCode: 400,
        success: false,
        data: null
      });
    }

    const dataToInsert = changeOrderItems.map(co => ({
      description: co.description,
      referenceDoc: co.referenceDoc,
      elements: co.elements,
      QtyNo: co.QtyNo,
      hours: co.hours,
      cost: co.cost,
      CoId: coId  // from params
    }));

    const created = await prisma.changeOrdertable.createMany({
      data: dataToInsert,
      skipDuplicates: true // optional: avoids inserting duplicates
    });

    return sendResponse({
      message: "Change Order Table created",
      res,
      statusCode: 200,
      success: true,
      data: created
    });

  } catch (error) {
    console.error(error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
};


const getRowCotable=async(req,res)=>{
  const{CoId}=req.params
  try {
    if(!CoId){
      return sendResponse({
        message:"Feilds are empty",
        res,
        statusCode:400,
        success:false,
        data:null
      }) 
    }
    const coRow= await prisma.changeOrdertable.findMany({
      where:{id:CoId}
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

const viewCOfiles = async (req, res) => {
  const { id, fid } = req.params;

  try {
    const CO = await prisma.changeOrder.findUnique({
      where: { id },
    });

    if (!CO) {
      return res.status(404).json({ message: "CO not found" });
    }

    const fileObject = CO.files.find((file) => file.id === fid);

    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

    const __dirname = path.resolve();
    const filePath = path.join(__dirname, fileObject.path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    const mimeType = mime.getType(filePath);
    res.setHeader("Content-Type", mimeType || "application/octet-stream");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${fileObject.originalName}"`
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    console.error("View File Error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong while viewing the file" });
  }
};

export { 
  AddChangeOrder ,
  changeOrderReceived,
  changeOrderSent,
  addCoResponse,
  getResponse,
  AddChangeOrdertable,
  getRowCotable,
  viewCOfiles,
};
