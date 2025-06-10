import { transporter } from "../../src/config/mailconfig.js";
import prisma from "../../src/lib/prisma.js";
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

        await prisma.project.update({
            where:{
                id:project.id
            },
            data:{
                mailReminder:true
            }
        })
        console.log(`Updated approvalReminderSent for project: ${project.name}`);
        return true
    } catch (error) {
        console.error(`Error sending approval reminder for project ${project.name}:`, error);
        return false
    }
}
