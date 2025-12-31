import nodeCron from "node-cron";
import prisma from "../src/lib/prisma.js";
import { sendMeetingReminder } from "../service/gmailservice/meetingMailService/reminderMail.js";

export async function runMeetingReminders() {
  const now = new Date();

  const meetings = await prisma.meeting.findMany({
    where: { reminderSent: false },
    include: {
      participants: { select: { email: true } }
    }
  });

  for (const meeting of meetings) {
    const reminderTime = new Date(
      new Date(meeting.startTime).getTime() - 15 * 60 * 1000
    );

    if (
      reminderTime.getFullYear() === now.getFullYear() &&
      reminderTime.getMonth() === now.getMonth() &&
      reminderTime.getDate() === now.getDate() &&
      reminderTime.getHours() === now.getHours() &&
      reminderTime.getMinutes() === now.getMinutes()
    ) {
      await sendMeetingReminder(meeting);
      await prisma.meeting.update({
        where: { id: meeting.id },
        data: { reminderSent: true }
      });
    }
  }
}

// Every minute
// nodeCron.schedule(
//   "*/1 * * * *",
//   () => runMeetingReminders(),
//   { timezone: "Asia/Kolkata" }
// );
// TEMP: every 1 minute for testing
nodeCron.schedule(
  "*/1 * * * *",
  () => runMeetingReminders(),
  { timezone: "Asia/Kolkata" }
);
