import { transporter } from "../../src/config/mailconfig.js";
import { approvalReminderTemplate } from "../../Templates/approvalDateReminder.js";


export default async function sendApprovalReminder(project){
    const mailOptions={
        from:"wbt.itdev@gmail.com",
        to:project.manager.email,
        subject:`Project Approval Reminder: ${project.name}`,
        html:approvalReminderTemplate(project.name,project.approvalDate)
    }
    try {
        await transporter.sendMail(mailOptions)
        console.log(`Approval reminder sent for project: ${project.name}`);

    } catch (error) {
        onsole.error(`Error sending approval reminder for project ${project.name}:`, error);
    }
}
