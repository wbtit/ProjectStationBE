import { transporter } from "../../src/config/mailconfig.js";
import { submissionReminderTemplate } from "../../Templates/submissionDateReminder.js";
import prisma from "../../src/lib/prisma.js";
import dotenv from "dotenv";
dotenv.config();

export default async function sendSubmissionReminder(project){
    const mailOptions={
        from:process.env.EMAIL,
        to:project.manager.email,
        subject:`Project Submission Reminder: ${project.name}`,
        html:submissionReminderTemplate(project.name,project.endDate)
    }
    try {
        await transporter.sendMail(mailOptions)
        console.log(`Submission reminder sent for project: ${project.name}`);
        await prisma.project.update({
            where:{
                id:project.id
            },
            data:{
              submissionMailReminder:true  
            }
        })
        console.log(`Updated submissionMailReminder for project: ${project.name}`)
        return true
    } catch (error) {
        console.error(`Error sending submission reminder for project ${project.name}:`, error);
        return false
    }
}

