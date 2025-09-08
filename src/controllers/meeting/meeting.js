import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { sendEmail } from "../../../service/gmailservice/index.js";
import { sendNotification } from "../../utils/notify.js";

const createMeeting=async(req,res)=>{
const {title,agenda,description,link,startTime,endTime,status,participants}= req.body
try {
    if(!title||!agenda||!link||!startTime||!participants){
    return sendResponse({
        message:"fields are empty",
        statusCode:400,
        success:false,
        data:null
    })
}
    // POST /api/meetings
const meeting = await prisma.meeting.create({
  data: {
    title,
    agenda,
    description,
    link,
    startTime,
    endTime,
    createdById: req.user.id,
    participants: {
      create: participants.map(p => ({
        userId: p.userId ?? null,
        email: p.email,
        rsvp: "PENDING",
        role: "ATTENDEE"
      }))
    }
  },
  include: { participants: true }
});
 return sendResponse({
    message:"Meeting created successfully",
    statusCode:200,
    success:true,
    data:meeting
 })
} catch (error) {
    console.log(error.message)
    return sendResponse({
        message:error.message,
        statusCode:500,
        success:false,
        data:null
    })
}
}

const getMeetingForUser=async(req,res)=>{
   try {
     const{id}=req.user

    // GET /api/meetings
const meetings = await prisma.meeting.findMany({
  where: {
    OR: [
      { createdById:id },
      { participants: { some: { userId:id } } }
    ]
  },
  include: { participants: true }
});
    return sendResponse({
        message:"Meetings Fetched successfully",
        statusCode:200,
        success:true,
        data:meetings
    })

   } catch (error) {
    console.log(error.message)
    return sendResponse({
        message:error.message,
        statusCode:500,
        success:false,
        data:null
    })
   }
}

const getMeetingById= async(req,res)=>{
    try {
        const {id}=req.params
    if(!id){
        return sendResponse({
            message:"Meeting Id is required",
            statusCode:400,
            success:false,
            data:null
        })
    }
    // GET /api/meetings/:id
    const meeting = await prisma.meeting.findUnique({
      where: { id: req.params.id },
      include: {
        createdBy: true,
        participants: true
      }
    });
    return sendResponse({
        message:"Meeting fetched successfully",
        statusCode:200,
        success:true,
        data:meeting
    })
    } catch (error) {
    console.log(error.message)
    return sendResponse({
        message:error.message,
        statusCode:500,
        success:false,
        data:null
    })
    }

}
const updateMeeting =async(req,res)=>{
    try {
        const {id}=req.params
        const {title,agenda,description,link,startTime,endTime,status}= req.body
        // PUT /api/meetings/:id
        const meeting = await prisma.meeting.update({
          where: { id:id },
          data: {
            title,
            agenda,
            description,
            link,
            startTime,
            endTime,
            status
          }
        });
        return sendResponse({
            message:"Meeting updated successfully",
            statusCode:200,
            success:true,
            data:meeting
        })

    } catch (error) {
      console.log(error.message)
    return sendResponse({
        message:error.message,
        statusCode:500,
        success:false,
        data:null
    })  
    }
}

const cancelMeeting=async(req,res)=>{
    try {
        const {id}=req.params
        // DELETE /api/meetings/:id
        await prisma.meeting.update({
          where: { id: id },
          data: { status: "CANCELLED" }
        });

    } catch (error) {
              console.log(error.message)
    return sendResponse({
        message:error.message,
        statusCode:500,
        success:false,
        data:null
    })  

    }
}
export{cancelMeeting,
    createMeeting,
    getMeetingById,
    getMeetingForUser,
    updateMeeting
}