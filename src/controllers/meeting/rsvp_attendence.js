import prisma from "../../lib/prisma.js";
import { sendResponse } from "../../utils/responder.js";
import { sendEmail } from "../../../service/gmailservice/index.js";
import { sendNotification } from "../../utils/notify.js";

const RSVP= async(req,res)=>{
    try {
        const{id}=req.params
    if(!id){
        return sendResponse({
            message:"Meeting Id is required",
            statusCode:400,
            success:false,
            data:null
        })
    }
    const meeting =await prisma.meetingAttendee.updateMany({
  where: {
    meetingId: req.params.id,
    userId: req.user.id
  },
  data: { rsvp: req.body.rsvp } // ACCEPTED / DECLINED / MAYBE
});

return sendResponse({
    message:"RVSP saved",
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

const markAttendence= async(req,res)=>{
    try {
        const{id}=req.params
    if(!id){
        return sendResponse({
            message:"Meeting Id is required",
            statusCode:400,
            success:false,
            data:null
        })
    }
    // POST /api/meetings/:id/attendance
const meeting =await prisma.meetingAttendee.update({
  where: {
    meetingId: req.params.id,
    userId: req.user.id
  },
  data: { joined: true }
});
 return sendResponse({
    message:"Attendence Marked",
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
const getAttendee= async(req,res)=>{
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

const attendees = await prisma.meetingAttendee.findMany({
  where: { meetingId: req.params.id },
  include: { user: true }
});

return sendResponse({
    message:"Attende list fetched successfully",
    statusCode:200,
    success:true,
    data:attendees
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

export{
    RSVP,
    getAttendee,
    markAttendence
}