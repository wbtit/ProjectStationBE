import { transporter } from "../../src/config/mailconfig.js";
import {  ifcCompletionInvoiceTemplate} from "../../Templates/ifcCompletionInvoiceTemplate.js";
import prisma from "../../src/lib/prisma.js";
import dotenv from "dotenv";
dotenv.config();

export default async function sendIFCCompletionAlertPMO(project,fabricator){
    const mailOptions={
        from:process.env.EMAIL,
        to:process.env.PMO_EMAIL,
        subject:`Raise Invoice for the IFC Completion of Project: ${project.name}`,
        html:ifcCompletionInvoiceTemplate(project,fabricator)
    }
    try {
        await transporter.sendMail(mailOptions)
        console.log(`Invoice reminder sent for project: ${project.name}`);
        await prisma.project.update({
            where:{
                id:project.id
            },
            data:{
              IFCCompletionAlertSent:true  
            }
        })
        console.log(`Updated submissionMailReminder for project: ${project.name}`)
        return true
    } catch (error) {
        console.error(`Error sending submission reminder for project ${project.name}:`, error);
        return false
    }
}

