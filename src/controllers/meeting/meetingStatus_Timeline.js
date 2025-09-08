import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { sendEmail } from "../../../service/gmailservice/index.js";
import { sendNotification } from "../../utils/notify.js";



const updateMeetingStatus=async(req,res)=>{
    const{meetingId}=req.params
    const{status}=req.body
    try {
        // PATCH /api/meetings/:id/status
    const updatedMeeting = await prisma.meeting.update({
      where: { id: meetingId },
      data: { status: status }
    });
    return sendResponse({
        message:"Meeting status updated successfully",
        statusCode:200,
        success:true,
        data:updatedMeeting
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
const getUpcomigMeetingByuserId=async(req,res)=>{
    const{id}=req.user
    try {
        // GET /api/meetings/upcoming
const upcoming = await prisma.meeting.findMany({
  where: {
    startTime: { gte: new Date() },
    OR: [
      { createdById: id },
      { participants: { some: { userId: id } } }
    ]
  },
  orderBy: { startTime: "asc" }
});
    return sendResponse({
        message: "Upcoming meetings retrieved successfully",
        statusCode: 200,
        success: true,
        data: upcoming
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
}

const getPastMeetingByUserId=async(req,res)=>{
    const{id}=req.user
    try {
        // GET /api/meetings/past
const past = await prisma.meeting.findMany({
  where: {
    endTime: { lt: new Date() },
    OR: [
      { createdById: id },
      { participants: { some: { userId: id } } }
    ]
  },
  orderBy: { endTime: "desc" }
});
    return sendResponse({
        message: "Past meetings retrieved successfully",
        statusCode: 200,
        success: true,
        data: past
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
}

export{updateMeetingStatus,
        getUpcomigMeetingByuserId,
        getPastMeetingByUserId
}