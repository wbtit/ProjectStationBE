import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { sendEmail } from "../../../service/gmailservice/index.js";
import { sendNotification } from "../../utils/notify.js";

const createMeeting = async (req, res) => {
  const { title, agenda, description, link, startTime, endTime, status, participants } = req.body;

  try {
    if (!title || !agenda || !link || !startTime || !participants) {
      return sendResponse({
        message: "fields are empty",
        statusCode: 400,
        success: false,
        data: null
      });
    }

    // 📌 Create meeting in DB
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

    // 📢 Send in-app notifications
    meeting.participants.forEach(participant => {
      if (participant.userId) {
        sendNotification(participant.userId, {
          subject: "New Meeting Created",
          text: `📅 A new meeting "${meeting.title}" has been scheduled.\n\n🕒 Start: ${meeting.startTime}\n🔗 Link: ${meeting.link}`
        });
      }
    });

    // 📧 Send email to all participants
    await sendEmail({
      to: meeting.participants.map(p => p.email).join(","), // <-- safer
      subject: `📅 Meeting Scheduled: ${meeting.title}`,
      text: `You have been invited to the meeting "${meeting.title}".\n\nAgenda: ${meeting.agenda}\n\n🕒 Start: ${meeting.startTime}\n🔗 Link: ${meeting.link}`,
      html: `
        <h2>📅 New Meeting Scheduled</h2>
        <p><strong>Title:</strong> ${meeting.title}</p>
        <p><strong>Agenda:</strong> ${meeting.agenda}</p>
        <p><strong>Description:</strong> ${meeting.description ?? "N/A"}</p>
        <p><strong>Start:</strong> ${new Date(meeting.startTime).toLocaleString()}</p>
        <p><strong>End:</strong> ${new Date(meeting.endTime).toLocaleString()}</p>
        <p><a href="${meeting.link}">🔗 Join Meeting</a></p>
      `
    });

    return sendResponse({
      message: "Meeting created successfully",
      statusCode: 200,
      success: true,
      data: meeting
    });
  } catch (error) {
    console.log(error.message);
    return sendResponse({
      message: error.message,
      statusCode: 500,
      success: false,
      data: null
    });
  }
};


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
          },
          include:{
            participants:true
          }
        });
        meeting.participants.forEach(participant => {
          if (participant.userId) {
            sendNotification(
              participant.userId,
              {
                subject: "Meeting Updated",
                text: `📅 The meeting "${meeting.title}" has been updated.\n\n🕒 Start: ${meeting.startTime}\n🔗 Link: ${meeting.link}`
              }
            );
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
          data: { status: "CANCELLED" },
          include:{
            participants:true
          }
        });
        meeting.participants.forEach(participant => {
          if (participant.userId) {
            sendNotification(
              participant.userId,
              {
                subject: "Meeting Cancelled",
                text: `📅 The meeting "${meeting.title}" has been cancelled.`
              }
            );
          }
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