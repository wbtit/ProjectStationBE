import sendApprovalReminder from "../service/gmailservice/sendApprovalReminder.js";
import sendSubmissionReminder from "../service/gmailservice/sendSubmiissionReminder.js";
import prisma from "../src/lib/prisma.js";
import nodeCron from "node-cron";

async function checkAndSendReminders() {
    console.log('Running daily reminder check....')
    const today= new Date()
    today.setHours(0,0,0,0)

    const projects= await prisma.project.findMany()

    for(const project of projects){
        const approvalDate= new Date(project.approvalDate)
        const approvalTomorrow= new Date(approvalDate)//copy of approval date

        approvalTomorrow=new Date(approvalTomorrow.getDate()-1)// Get the day before the approval date
        approvalTomorrow.setHours(0,0,0,0)

        if(approvalTomorrow.getTime()=== today.getTime()){
            await sendApprovalReminder(project)
        }

        const submissionDate= new Date(project.endDate)
        const submissionTomorrow= new Date(submissionDate)

        submissionTomorrow= new Date(submissionDate.getDate()-1)
        submissionTomorrow.setHours(0,0,0,0)

        if(submissionTomorrow.getTime()=== today.getTime()){
            sendSubmissionReminder(project)
        }
    }
    console.log('Daily reminder check completed.');
}
nodeCron.schedule('1 0 * * *',()=>{
    checkAndSendReminders()
},{
    timezone:"Asia/Kolkata"
})
console.log('Scheduler started for daily reminders.')

module.exports={
    checkAndSendReminders
}