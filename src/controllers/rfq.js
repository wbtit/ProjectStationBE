import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { sendEmail } from "../../service/gmailservice/index.js";
import fs from "fs"
import mime from "mime"
import path from "path"
import { sendNotification } from "../utils/notify.js";
import { response } from "express";




const addRFQ=async(req,res)=>{
    const {projectName,recepient_id,subject,description,status,connectionDesign,
      miscDesign,customerDesign
    }=req.body
    const {id}=req.user
    //// console.log("The Rfq data Input",req.body)
    try {
        if ( !recepient_id||!subject || !description) {
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
            path: `/public/rfqtemp/${file.filename}`, // Relative path
          }));

          let salesPersonId;
           const user= await prisma.users.findUnique({where:{id:id}})
            //console.log(user.id)
           if(user.role === 'SALES_PERSON' || user.role==='DEPT_MANAGER' || user.role==='OPERATION_EXECUTIVE' ||user.is_superuser){
              salesPersonId=user.id
              //console.log(salesPersonId)
           }
          const newrfq= await prisma.rFQ.create({
            data:{
                projectName,
                sender_id:id,
                createdById:id,
                salesPersonId:salesPersonId ||null,
                status:"RECEIVED",
                connectionDesign,
                miscDesign,
                customerDesign,
                subject,
                description,
                files:fileDetails,
                recepient_id:recepient_id
            },
            include:{
                recepients:true,
                sender:true
            }
          })
          const htmlContent = `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Project Station - RFI Notification</title>
              <style>
                body {
                  font-family: 'Courier New', Courier, monospace;
                  background-color: #f2fdf3; /* Light greenish background */
                  color: #333;
                  margin: 0;
                  padding: 0;
                }
          
                .email-container {
                  background-color: #ffffff;
                  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
                  border-radius: 10px;
                  padding: 35px;
                  margin-top: 50px;
                  max-width: 650px;
                  margin-left: auto;
                  margin-right: auto;
                }
          
                .email-header {
                  background-color: #6adb45;
                  color: white;
                  padding: 25px;
                  border-radius: 8px;
                  text-align: center;
                }
          
                .email-header .title {
                  font-size: 26px;
                  font-weight: bold;
                  margin: 0;
                }
          
                .email-body {
                  margin-top: 25px;
                  text-align: left;
                  line-height: 1.6;
                }
          
                .card {
                  background-color: #f9f9f9;
                  border-radius: 8px;
                  padding: 25px;
                  margin-top: 30px;
                  border: none;
                }
          
                .footer {
                  text-align: center;
                  margin-top: 40px;
                  font-size: 14px;
                  color: #555;
                }
          
                .footer img {
                  max-width: 150px;
                  margin-top: 15px;
                }
          
                a {
                  color: #6adb45;
                  text-decoration: none;
                  font-weight: bold;
                }
          
                .green-text {
                  color: #6adb45;
                }
          
                h2 {
                  font-size: 20px;
                  color: #333;
                  margin-top: 20px;
                }
          
                p {
                  font-size: 16px;
                  color: #555;recepient_id
                }
          
                /* Ensure logo is centered in footer */
                .footer {
                  text-align: center;
                  margin-top: 40px;
                }
          
                .footer img {
                  max-width: 150px;
                  display: block;
                  margin-left: auto;
                  margin-right: auto;
                }
          
                /* Ensure the email container is centered */
                .email-container {
                  text-align: center;
                }
              </style>
          </head>
          
          <body>
              <div class="email-container">
                  <div class="d-flex justify-content-between align-items-center">
                  <div class="title">
                      <span>You’ve Received a New RFI</span><br/>
                      <span><strong>Project:</strong> ${newrfq.projectName}</span>
                  </div>
                  <div> 
                      <img 
                          src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9"
                          alt="Company Logo" 
                          style="max-width: 100px;" />
                  </div>
              </div>
                  <div class="email-body">
                      <h2>Welcome to Project Station, <b>${newrfq.recepients.username}</b>!</h2>
                      <p>You have received a new RFI notification. Here are the details:</p>
          
                      <p><strong>Project Name:</strong> ${newrfq.projectName}</p>
                      <p><strong>Sender:</strong> ${newrfq.sender.username}</p>
                      <p><strong>Date:</strong> ${newrfq.date}</p>
                      <p><strong>Subject:</strong> ${newrfq.subject}</p>
                      <p>You can check your RFI by clicking the link <a href="projectstation.whiteboardtec.com">here</a>.</p>
          
                      <div class="card">
                          <div class="card-body">
                              ${newrfq.description}
                       OPEN   </div>
                      </div>
          
                      <p>Thanks & Regards,</p>
                      <p><b> ${newrfq.sender.username}</b></p>
                      <p>Bangalore</p>
                  </div>
          
                  <div class="footer">
                      <img
                          src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9"
                          alt="Company Logo"
                      />
                      <p><b>Whiteboard Technologies Pvt. Ltd.</b></p>
                      <p>Bangalore</p>
                  </div>
              </div>
          </body>
          </html>
          `;

          sendEmail({
            html: htmlContent,
            to: newrfq.recepients.email,
            subject: subject,
            text: description,
          });
          if (!newrfq) {
            return sendResponse({
              message: "Failed to create RFQ",
              res,
              statusCode: 400,
              success: false,
              data: null,
            });
          }
          //console.log("Newly created RFQ:",newrfq)
          // Emit real-time notification using socket.io
          sendNotification(recepient_id,{
            message:`New RFQ received:${recepient_id}`,
            rfqId:newrfq.id
          })
      
          return sendResponse({
            message: "RFQ added successfully",
            res,
            statusCode: 200,
            success: true,
            data: newrfq,})
    } catch (error) {
        console.log(error);
    return sendResponse({
      message: error.message,
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
    }
}

const updateRfq=async(req,res)=>{
  const{id}=req.params
  try{
    if(!id){
    return sendResponse({
      message:"RFQId is required",
      statusCode:400,
      success:false,
      data:null
    })
  }
  const updatedRfq= await prisma.rFQ.update({
    where:{id:id},
    data:req?.body
  })

  if(!updateRfq){
    return sendResponse({
      message:"RFQ Failed to updated",
      statusCode:400,
      success:false,
      data:null
    })
  }

  return sendResponse({
    message:"RFQ updated",
    statusCode:200,
    success:true,
    data:updateRfq
  })}catch(error){
    console.log(error.message)
    return sendResponse({
      message:error.message,
      statusCode:500,
      success:false,
      data:null
    })
  }
}

const sentRFQByUser = async (req, res) => {
  const { id } = req.user;
  try {
    const sentRFQ = await prisma.rFQ.findMany({
      where: {
        sender_id: id,
      },
      include: {
        recepients: true,
        response:{
          orderBy: { createdAt: 'asc' },
           select:{
            id:true,
            file:true,
            description:true,
            status:true,
            wbtStatus:true,
            createdAt:true,
            userId:true,
            rfqId:true,
            parentResponseId:true
          }
        },
        file:true
      },
    });
    const filtered = sentRFQ.map(rfq => {
     
      return {
        ...rfq,
        response: Array.isArray(rfq.response)
          ? rfq.response.filter(resp => resp.parentResponseId === null)
          : [],
      };
    });
    if (!sentRFQ) {
      return sendResponse({
        message: "Failed to get RFQs",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    return sendResponse({
      message: "Sent RFQs fetched success",
      res,
      statusCode: 200,
      success: true,
      data: filtered,
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

const RFQByID = async (req, res) => {
  const { id } = req.params;

  //// console.log(id, "This is rfq ID");

  try {
    const rfq = await prisma.rFQ.findUnique({
      where: {
        id,
      },
      include: {
        recepients:true,
        response:{
          orderBy: { createdAt: 'asc' },
           select:{
            id:true,
            file:true,
            description:true,
            status:true,
            wbtStatus:true,
            createdAt:true,
            userId:true,
            rfqId:true,
            parentResponseId:true
          }
        },
        file:true
      },
    });
    const filtered = rfq
  ? {
      ...rfq,
      response: Array.isArray(rfq.response)
        ? rfq.response.filter(res => res.parentResponseId === null)
        : [],
    }
  : null;
    //// console.log(rfq, "This is rfq");

    sendResponse({
      message: "RFQ fetch success",
      res,
      statusCode: 200,
      success: true,
      data: filtered,
    });
  } catch (error) {
    // console.log(error.message);
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
    const sentRFQ = await prisma.rFQ.findMany({
      where: {
        recepient_id: id,
      },
      include: {
        recepients: true,
        response:{
          orderBy: { createdAt: 'asc' },
          select:{
            id:true,
            file:true,
            description:true,
            status:true,
            wbtStatus:true,
            createdAt:true,
            userId:true,
            rfqId:true,
            parentResponseId:true,
            childResponses:true
          }
        },
        file:true,
        sender:{
          select:{
            email:true,
            f_name:true,
            m_name:true,
            l_name:true,
            phone:true,
            fabricator:true
          }
        }
      },
    });

    if (!sentRFQ) {
      return sendResponse({
        message: "Failed to get RFQs",
        res,
        statusCode: 400,
        success: false,
        data: null,
      });
    }
    const filtered = sentRFQ.map(rfq => {
     
      return {
        ...rfq,
        response: Array.isArray(rfq.response)
          ? rfq.response.filter(resp => resp.parentResponseId === null)
          : [],
      };
    });
    return sendResponse({
      message: "Inbox RFQs fetched success",
      res,
      statusCode: 200,
      success: true,
      data: filtered,
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
}

//to close the RFQ communication
const RFQClosed = async (req, res) => {
  const { id } = req?.params;
  try {
    const rfqClosed = await prisma.rFQ.update({
      where: {
        id,
      },
      data: {
        status: "CLOSED",
      },
    });
    if (!rfqClosed) {
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
      data: rfqseen,
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

const RfqViewFiles = async (req, res) => {
  const { id, fid } = req.params;
  //console.log("I am viewfile route",id)
  try {
    const rFQ = await prisma.rFQ.findUnique({
      where: { id },
    });

    if (!rFQ) {
      return res.status(404).json({ message: "rFQ not found" });
    }

    const fileObject = rFQ.files.find((file) => file.id === fid);

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

const RfqresponseViewFiles = async (req, res) => {
  const { id, fid } = req.params;

  try {
    const rFQ = await prisma.rFQResponse.findUnique({
      where: { id },
    });

    if (!rFQ) {
      return res.status(404).json({ message: "rFQResponse not found" });
    }

    const fileObject = rFQ.files.find((file) => file.id === fid);

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

const addRfqResponse=async(req,res)=>{
const{rfqId}=req.params
const{description,parentResponseId,status}=req.body
console.log("The response of the rfq",req.body)
//console.log("parentResponseId:,",parentResponseId)
const{id}=req.user

try {
  if(!rfqId){
    return sendResponse({
      message:"RfqId is required",
      res,
      statusCode:400,
      success:false,
      data:null
    })
  }
  const rfqInreview = await prisma.rFQ.update({
    where: {
      id:rfqId,
    },
    data: {
      status: "IN_REVIEW",
    },
  });
  if (!rfqInreview) {
    return sendResponse({
      message: "Failed to update the Status of the RFQ to IN_REVIEW",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
if(parentResponseId!=undefined){
 const parentResponse= await prisma.rFQResponse.update({
  where:{id:parentResponseId},
  data:{
    wbtStatus:status
  }
 })
 if(!parentResponse){
    return sendResponse({
      message: "Failed to update the Status of the parent RFQ",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
}
  
  const fileDetails = req.files.map((file) => ({
    filename: file.filename, // UUID + extension
    originalName: file.originalname, // Original name of the file
    id: file.filename.split(".")[0], // Extract UUID from the filename
    path: `/public/rfqResponsetemp/${file.filename}`, // Relative path
  })); 
  //console.log("File deatiles in RFQ:",fileDetails)
if(parentResponseId!=undefined){
  const updateParentRfqStatus= await prisma.rFQResponse.update({
  where:{id:parentResponseId},
  data:{
    status:status
  }
})
//console.log("The parent rfq",updateParentRfqStatus)
if (!updateParentRfqStatus) {
    return sendResponse({
      message: "Failed to update the Status of the Parent RFQ",
      res,
      statusCode: 500,
      success: false,
      data: null,
    });
  }
}

  const addResponse= await prisma.rFQResponse.create({
    data:{
      userId:id,
      description:description,
      rfqId:rfqId,
      files:fileDetails,
      parentResponseId:parentResponseId || null,
      status:status
    }
  })
  //console.log(addResponse)
  return sendResponse({
    message:"Response created",
    res,
    statusCode:200,
    success:true,
    data:addResponse
  })
} catch (error) {
  console.log(error.message)
    return sendResponse({
      message:"failed to create Response",
      res,
      statusCode:500,
      success:false,
      data:''
    })
}
}
const getRfqResponseById=async(req,res)=>{
  const{id}=req.params
  //console.log("RFQRESPONSEID",id)
  try {
    const response=await prisma.rFQResponse.findUnique({
      where:{id:id},
      include:{
        file:true,
        childResponses:true,
        user:{
          select:{
            f_name:true,
            m_name:true,
            l_name:true
          }
        }
      }
    })
    //console.log("Response:",response)
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
      message:"failed to create Response",
      res,
      statusCode:500,
      success:false,
      data:null
    })
  }
}


export { 
  addRFQ,
  updateRfq,
  sentRFQByUser,
  Inbox,
  RFQClosed,
  RFQByID,
  RfqViewFiles,
  RfqresponseViewFiles,

  addRfqResponse,
  getRfqResponseById
};
