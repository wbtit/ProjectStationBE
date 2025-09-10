import { transporter } from "../../../src/config/mailconfig.js";
import dotenv from "dotenv";
dotenv.config();

export async function sendMeetingReminder(meeting) {
  const participantEmails = meeting.participants.map(p => p.email);

  const mailOptions = {
    from: process.env.EMAIL,
    to: participantEmails,
    subject: `⏰ Reminder: Meeting "${meeting.title}" starts soon`,
    html: `
      <h2>Reminder: ${meeting.title}</h2>
      <p><b>Agenda:</b> ${meeting.agenda}</p>
      <p><b>Start:</b> ${new Date(meeting.startTime).toLocaleString()}</p>
      <p><b>Join Link:</b> <a href="${meeting.link}">${meeting.link}</a></p>
      <hr/>
      <p>This meeting will begin in 15 minutes.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Reminder sent for meeting: ${meeting.title}`);
    return true;
  } catch (error) {
    console.error(`❌ Error sending reminder for ${meeting.title}:`, error);
    return false;
  }
}
