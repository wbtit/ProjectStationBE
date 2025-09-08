import { transporter } from "../../../src/config/mailconfig.js";
import prisma from "../../../src/lib/prisma.js";
import dotenv from "dotenv";
dotenv.config();

export async function sendMeetingInvite(meeting) {
  const participantEmails = meeting.participants.map(p => p.email);

  const mailOptions = {
    from: process.env.EMAIL,
    to: participantEmails,
    subject: ` New Meeting Scheduled: ${meeting.title}`,
    html: `
      <h2>${meeting.title}</h2>
      <p><b>Agenda:</b> ${meeting.agenda}</p>
      <p><b>Description:</b> ${meeting.description ?? "N/A"}</p>
      <p><b>Start:</b> ${new Date(meeting.startTime).toLocaleString()}</p>
      <p><b>End:</b> ${new Date(meeting.endTime).toLocaleString()}</p>
      <p><b>Join Link:</b> <a href="${meeting.link}">${meeting.link}</a></p>
      <hr/>
      <p>Please RSVP via the platform.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Meeting invite sent for meeting: ${meeting.title}`);

    // optional: log in DB for tracking
    await prisma.meeting.update({
      where: { id: meeting.id },
      data: { updatedAt: new Date() }
    });

    return true;
  } catch (error) {
    console.error(`❌ Error sending meeting invite for ${meeting.title}:`, error);
    return false;
  }
}
