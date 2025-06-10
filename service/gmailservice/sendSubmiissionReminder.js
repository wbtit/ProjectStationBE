import { transporter } from "../../src/config/mailconfig.js";
import { submissionReminderTemplate } from "../../Templates/submissionDateReminder.js";


export default async function sendSubmissionReminder(project){
    const mailOptions={
        from:"wbt.itdev@gmail.com",
        to:project.manager.email,
        subject:`Project Submission Reminder: ${project.name}`,
        html:sendSubmissionReminder(project.name,project.approvalDate)
    }
    try {
        await transporter.sendMail(mailOptions)
        console.log(`Submission reminder sent for project: ${project.name}`);

    } catch (error) {
        console.error(`Error sending submission reminder for project ${project.name}:`, error);
    }
}

