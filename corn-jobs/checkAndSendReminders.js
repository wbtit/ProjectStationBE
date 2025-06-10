import sendApprovalReminder from "../service/gmailservice/sendApprovalReminder.js";
import sendSubmissionReminder from "../service/gmailservice/sendSubmiissionReminder.js";
import prisma from "../src/lib/prisma.js";
import nodeCron from "node-cron";

async function checkAndSendReminders() {
    console.log('Running daily reminder check....')
    const today= new Date()
    today.setHours(0,0,0,0)

    const projects= await prisma.project.findMany({
        include:{
            manager:{
                select:{
                    email:true
                }
            }
        }
    })

    for(const project of projects){
        // console.log("The project:",project);
        const approvalDate= new Date(project.approvalDate)
        const approvalTomorrow= new Date(approvalDate)//copy of approval date

         approvalTomorrow.setDate(approvalTomorrow.getDate() - 1);// Get the day before the approval date
        approvalTomorrow.setHours(0,0,0,0)

        if(approvalTomorrow.getTime()=== today.getTime()){
            if (!project.mailReminder) {
                console.log(`Attempting to send approval reminder for project: ${project.name}`);
                await sendApprovalReminder(project);
            } else {
                console.log(`Approval reminder already sent for project: ${project.name}. Skipping.`);
            }
        }

        const submissionDate= new Date(project.endDate)
        const submissionTomorrow= new Date(submissionDate)

        submissionTomorrow.setDate(submissionDate.getDate()-1)
        submissionTomorrow.setHours(0,0,0,0)

        if(submissionTomorrow.getTime()=== today.getTime()){
            if (!project.submissionMailReminder) {
                console.log(`Attempting to send submission reminder for project: ${project.name}`);
                await sendSubmissionReminder(project);
            } else {
                console.log(`Submission reminder already sent for project: ${project.name}. Skipping.`);
            }
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

export{
    checkAndSendReminders
}