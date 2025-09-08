import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { sendEmail } from "../../../service/gmailservice/index.js";
import { sendNotification } from "../../utils/notify.js";

const meetingSummary = async (req, res) => {
    const { id } = req.params
    try {
        // GET /api/meetings/summary
        // GET /api/meetings/:id/summary
const summary = await prisma.meeting.findUnique({
  where: { id: id },
  include: {
    participants: true
  }
});

// Example aggregation
const stats = {
  totalInvited: summary.participants.length,
  accepted: summary.participants.filter(p => p.rsvp === "ACCEPTED").length,
  declined: summary.participants.filter(p => p.rsvp === "DECLINED").length,
  attended: summary.participants.filter(p => p.joined).length
};

        return sendResponse({
            message: "Meeting summary retrieved successfully",
            statusCode: 200,
            success: true,
            data: stats
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
const attendanceHistory = async (req, res) => {
    const { userId } = req.params
    try {
        // GET /api/users/:id/meetings/attendance
        const attendance = await prisma.meetingAttendee.findMany({
            where: {
                userId: userId,
                joined: true
            },
            include: { meeting: true }
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

const meetingStats=async(req,res)=>{
    try {
        // GET /api/meetings/stats
const stats = await prisma.meeting.groupBy({
  by: ["status"],
  _count: true
});

        return sendResponse({
            message: "Meeting statistics retrieved successfully",
            statusCode: 200,
            success: true,
            data: stats
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

export{
    meetingSummary,
    attendanceHistory,
    meetingStats
}