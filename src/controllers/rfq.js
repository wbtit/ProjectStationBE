import prisma from "../lib/prisma.js";
import { sendResponse } from "../utils/responder.js";
import { sendEmail } from "../../service/gmailservice/index.js";
import fs from "fs"
import mime from "mime"
import path from "path"
import { sendNotification } from "../utils/notify.js";
import { fileURLToPath } from "url";

// Recreate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





const addRFQ=async(req,res)=>{
    const {projectName,projectNumber,recepient_id,estimationDate,tools,bidPrice,subject,description,sender_id,connectionDesign,fabricatorId,
      miscDesign,customerDesign,detailingMain,
    detailingMisc
    }=req.body
    const {id}=req.user
    //console.log(req.user)
    console.log("The Rfq data Input",req.body)

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
            path: `rfqtemp/${file.filename}`, // Relative path
          }));

          let salesPersonId;
            //console.log("logged in user id-=-=--=--=-=",id)
           const user= await prisma.users.findUnique({where:{id:id}})
            //console.log(user)
           if(user.role === 'SALES_PERSON' || user.role==='DEPT_MANAGER' || user.role==='OPERATION_EXECUTIVE' ||user.is_superuser){
              salesPersonId=user.id
              //console.log(salesPersonId)
           }
          const newrfq= await prisma.rFQ.create({
            data:{
                projectName,
                projectNumber,
                fabricatorId:fabricatorId?fabricatorId:req.user.fabricatorId,
                sender_id:sender_id?sender_id:id,
                bidPrice:bidPrice,
                createdById:id,
                salesPersonId:salesPersonId ||null,
                status:"RECEIVED",
                connectionDesign:(connectionDesign==="true"),
                detailingMain:(detailingMain==="true"),
                detailingMisc:(detailingMisc=== "true"),
                tools,
                miscDesign:(miscDesign==="true"),
                customerDesign:(customerDesign==="true"),
                subject,
                description,
                estimationDate,
                files:fileDetails,
                recepient_id:recepient_id
            },
            include:{
                recepients:true,
                sender:true
            }
          })
          const htmlContent = `<!DOCTYPE html>
          <html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Whiteboard Engineering - Project Update</title>

    <style type="text/css">
      /* Global Reset */
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, Helvetica, sans-serif;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #f6f7f9;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      td {
        padding: 0;
      }
      img {
        border: 0;
        outline: none;
        text-decoration: none;
        display: block;
        -ms-interpolation-mode: bicubic;
      }
      a {
        text-decoration: none;
        color: #8cc63f;
      }
      .main-content-wrapper {
        max-width: 600px;
        width: 100%;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
      }

      /* Typography */
      .title {
        font-size: 18px;
        font-weight: 600;
        color: #333333;
      }
      .subtitle {
        font-size: 14px;
        color: #555555;
        line-height: 20px;
      }
      .divider {
        background-color: #8cc63f;
        height: 4px;
      }

      /* Mobile Styles */
      @media only screen and (max-width: 600px) {
        .main-content-wrapper {
          width: 100% !important;
        }
        .content-padding {
          padding: 0 20px !important;
        }
        .logo-cell {
          padding: 20px 20px 10px 20px !important;
          text-align: center !important;
        }
        .project-name-cell {
          text-align: center !important;
          padding-top: 5px !important;
        }
        .button-link {
          width: 100% !important;
        }
      }
    </style>
  </head>

  <body style="margin: 0; padding: 0; background-color: #f6f7f9">
    <table align="center" width="100%" bgcolor="#f6f7f9">
      <tr>
        <td align="center" valign="top" style="padding: 30px 10px">
          <table
            class="main-content-wrapper"
            align="center"
            cellpadding="0"
            cellspacing="0"
          >
            <!-- Header -->
            <tr>
              <!-- Left: Logo (30%) -->
              <td
                align="left"
                style="
                  width: 30%;
                  padding: 20px 20px 10px 30px;
                  background-color: #ffffff;
                  vertical-align: middle;
                "
                class="logo-cell"
              >
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9"
                  alt="Whiteboard Engineering Logo"
                  width="140"
                  style="max-width: 100%; height: auto; display: block"
                />
              </td>

              <!-- Right: Project Name (70%) -->
              <td
                align="right"
                style="
                  width: 70%;
                  padding: 20px 30px 10px 10px;
                  font-family: Arial, sans-serif;
                  font-size: 18px;
                  font-weight: 600;
                  color: #ffffff;
                  background-color: #8cc63f;
                  text-align: left;
                  vertical-align: middle;
                "
                class="project-name-cell"
              >
                ${newrfq.projectName || "N/A"}
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td colspan="2" class="divider"></td>
            </tr>

            <!-- Body -->
            <tr>
              <td colspan="2" style="padding: 30px 40px">
                <p style="margin: 0 0 5px 0; font-size: 13px; color: #888888">
                  Date: ${newrfq.createdAt}
                </p>

                <p
                  style="
                    margin: 15px 0;
                    font-size: 16px;
                    font-weight: bold;
                    color: #333333;
                  "
                >
                  Subject: Status Update for ${newrfq.projectName || "N/A"}
                </p>

                <p
                  style="
                    margin: 20px 0;
                    font-size: 15px;
                    color: #333333;
                    line-height: 24px;
                  "
                >
                  Dear ${newrfq.recepients.f_name || "Sir/Ma'am"},
                </p>

                <p
                  style="
                    margin: 10px 0 25px 0;
                    font-size: 15px;
                    color: #333333;
                    line-height: 24px;
                  "
                >
                  ${newrfq.description || "No description provided."}
                </p>

                <!-- Button -->
                <p align="center" style="margin: 30px 0 40px 0">
                  <a
                    href="https://projectstation.whiteboardtec.com/"
                    target="_blank"
                    style="
                      background-color: #8cc63f;
                      border: 1px solid #8cc63f;
                      border-radius: 6px;
                      color: #ffffff;
                      display: inline-block;
                      font-size: 14px;
                      font-weight: bold;
                      line-height: 18px;
                      text-align: center;
                      padding: 12px 30px;
                      text-decoration: none;
                      letter-spacing: 0.5px;
                    "
                  >
                    Login With Your Credentials
                  </a>
                </p>

                <!-- Signature -->
                <p style="font-size: 15px; color: #333333; margin-bottom: 10px">
                  Thanks & Regards,
                </p>

                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td valign="top" style="padding-right: 15px">
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9"
                        alt="Sender"
                        width="80"
                        height="auto"
                        style="border-radius: 10%; display: block"
                      />
                    </td>

                    <td valign="middle">
                      <p
                        style="
                          margin: 0;
                          font-size: 16px;
                          font-weight: bold;
                          color: #333333;
                        "
                      >
                        ${[
                          newrfq?.sender?.f_name,
                          newrfq?.sender?.m_name,
                          newrfq?.sender?.l_name,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      </p>
                      <p style="margin: 2px 0; font-size: 14px; color: #888888">
                        ${newrfq?.sender?.designation || "N/A"}
                      </p>
                      <p style="margin: 2px 0; font-size: 14px; color: #888888">
                        Whiteboard Engineering |
                        <a
                          href="https://whiteboardtec.com/"
                          style="color: #8cc63f"
                          >whiteboardtec.com</a
                        >
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                colspan="2"
                align="center"
                style="padding: 20px 30px 30px 30px; background-color: #f6f7f9"
              >
                <p
                  style="
                    margin: 0;
                    font-size: 12px;
                    color: #aaaaaa;
                    line-height: 18px;
                  "
                >
                  © ${new Date().getFullYear()} Whiteboard Engineering. All
                  Rights Reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
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
            message:`New RFQ received:${newrfq.subject}`,
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
        fabricators:true,
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
    console.log(error.message)
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
        fabricators:true,
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
  const { id,is_superuser } = req.user;
  try {
    let sentRFQ
    if(is_superuser){
      sentRFQ = await prisma.rFQ.findMany({
        include: {
        recepients: true,
        fabricators:true,
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
    }else{
      sentRFQ = await prisma.rFQ.findMany({
      where: {
        recepient_id: id,
      },
      include: {
        recepients: true,
        fabricators:true,
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
    }
    
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

  try {
    const rFQ = await prisma.rFQ.findUnique({
      where: { id:id },
    });

    if (!rFQ) {
      return res.status(404).json({ message: "RFQ not found" });
    }

    const fileObject = rFQ.files.find((file) => file.id === fid);
    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

        // 3. Construct safe absolute path
          const projectRoot =
            process.env.PUBLIC_DIR || path.join(__dirname, "..", "..", "public");

      const safePath = path.join(projectRoot, fileObject.path);
    if (!fs.existsSync(safePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    const fileExt = path.extname(safePath).toLowerCase();
    const mimeType = mime.getType(safePath) || "application/octet-stream";

    if (fileExt === '.zip') {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileObject.originalName}"`
      );
    } else {
      res.setHeader("Content-Type", mimeType);
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${fileObject.originalName}"`
      );
    }
// 6. Stream file to client
    const fileStream = fs.createReadStream(safePath);
    fileStream.pipe(res);

    fileStream.on("error", (err) => {
      console.error("File stream error:", err);
      res.status(500).json({ message: "Error reading file" });
    });
  } catch (error) {
    console.error("View File Error:", error); 
    return res.status(500).json({
      message: "Something went wrong while viewing the file",
      error: error.message,
    });
  }
};

const RfqresponseViewFiles = async (req, res) => {
  const { id, fid } = req.params;

  try {
    const rFQResponse = await prisma.rFQResponse.findUnique({
      where: { id:id },
    });

    if (!rFQResponse) {
      return res.status(404).json({ message: "RFQ Response not found" });
    }

    const fileObject = rFQResponse.files.find((file) => file.id === fid);
    if (!fileObject) {
      return res.status(404).json({ message: "File not found" });
    }

    // 3. Construct safe absolute path
       const projectRoot =
         process.env.PUBLIC_DIR || path.join(__dirname, "..", "..", "public");

   const safePath = path.join(projectRoot, fileObject.path);

    if (!fs.existsSync(safePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    const fileExt = path.extname(safePath).toLowerCase();
    const mimeType = mime.getType(safePath) || "application/octet-stream";

    if (fileExt === '.zip') {
      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileObject.originalName}"`
      );
    } else {
      res.setHeader("Content-Type", mimeType);
      res.setHeader(
        "Content-Disposition",
        `inline; filename="${fileObject.originalName}"`
      );
    }

// 6. Stream file to client
    const fileStream = fs.createReadStream(safePath);
    fileStream.pipe(res);

    fileStream.on("error", (err) => {
      console.error("File stream error:", err);
      res.status(500).json({ message: "Error reading file" });
    });
  } catch (error) {
    console.error("View File Error:", error); 
    return res.status(500).json({
      message: "Something went wrong while viewing the file",
      error: error.message,
    });
  }
};


const addRfqResponse=async(req,res)=>{
const{rfqId}=req.params
const{description,parentResponseId,status}=req.body
console.log("The response of the rfq",description,status)
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
    path: `rfqResponsetemp/${file.filename}`, // Relative path
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

  const rfq= await prisma.rFQ.findUnique({
    where:{id:rfqId}
  })
  if(!rfq){
    return sendResponse({
      message:"Failed to fetch the RFQ",
      res,
      statusCode:400,
      success:false,
      data:null
    })
  }
  if(req.user.id !== rfq.sender_id){
    // Notify original sender of the ChangeOrder
    await sendNotification(rfq.sender_id, {
      message: `New response on your RFQ: ${rfq.subject}`,
      rfqId: rfq.id,
    });
  }else{
    await sendNotification(rfq.recepient_id, {
      message: `New response on RFQ you received: ${rfq.subject}`,
      rfqId: rfq.id,
    });
  }
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
  console.log("RFQRESPONSEID",id)
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
