import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { sendEmail } from "../../../service/gmailservice/index.js";
import { sendNotification } from "../../utils/notify.js";

const addParticipants=async(req,res)=>{
    const {id}=req.params
    const{email,userId}=req.body
    try {
        // POST /api/meetings/:id/participants
    const participant = await prisma.meetingAttendee.create({
      data: {
        meetingId:id,
        userId: userId ?? null,
        email: email,
        rsvp: "PENDING",
        role: "ATTENDEE"
  }
});
    return sendResponse({
        message:"Participant added successfully",
        statusCode:201,
        success:true,
        data:participant
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

const updateParticipant=async(req,res)=>{
    const{attendeeId}=req.params
    const{rsvp,role}=req.body
    try {
        // PUT /api/meetings/:id/participants/:attendeeId
    const updatedData= await prisma.meetingAttendee.update({
  where: { id:attendeeId},
  data: {
    rsvp:rsvp,
    role: role
  }
});
    return sendResponse({
        message:"Participant updated successfully",
        statusCode:200,
        success:true,
        data:updatedData
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

const removeParticipant=async(req,res)=>{
    const{attendeeId}=req.params
    try {
        // DELETE /api/meetings/:id/participants/:attendeeId
        await prisma.meetingAttendee.delete({
            where: { id: attendeeId }
        });
        return sendResponse({
            message: "Participant removed successfully",
            statusCode: 200,
            success: true,
            data: null
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
addParticipants,
updateParticipant,
removeParticipant
}