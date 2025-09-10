import sendApprovalReminder from "../service/gmailservice/sendApprovalReminder.js";
import sendSubmissionReminder from "../service/gmailservice/sendSubmiissionReminder.js";
import { sendMeetingReminder } from "../service/gmailservice/meetingMailService/reminderMail.js";
import prisma from "../src/lib/prisma.js";
import nodeCron from "node-cron";

async function checkAndSendReminders() {
  console.log("Running daily reminder check....");
  const now = new Date();

  // normalize today to midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ───────────────────────────────
  // PROJECT REMINDERS
  // ───────────────────────────────
  const projects = await prisma.project.findMany({
    include: {
      manager: {
        select: { email: true }
      }
    }
  });

  for (const project of projects) {
    const approvalDate = new Date(project.approvalDate);
    const approvalTomorrow = new Date(approvalDate);
    approvalTomorrow.setDate(approvalTomorrow.getDate() - 1);
    approvalTomorrow.setHours(0, 0, 0, 0);

    if (approvalTomorrow.getTime() === today.getTime()) {
      if (!project.mailReminder) {
        console.log(
          `Attempting to send approval reminder for project: ${project.name}`
        );
        await sendApprovalReminder(project);
      } else {
        console.log(
          `Approval reminder already sent for project: ${project.name}. Skipping.`
        );
      }
    }

    const submissionDate = new Date(project.endDate);
    const submissionTomorrow = new Date(submissionDate);
    submissionTomorrow.setDate(submissionDate.getDate() - 1);
    submissionTomorrow.setHours(0, 0, 0, 0);

    if (submissionTomorrow.getTime() === today.getTime()) {
      if (!project.submissionMailReminder) {
        console.log(
          `Attempting to send submission reminder for project: ${project.name}`
        );
        await sendSubmissionReminder(project);
      } else {
        console.log(
          `Submission reminder already sent for project: ${project.name}. Skipping.`
        );
      }
    }
  }

  // ───────────────────────────────
  // MEETING REMINDERS
  // ───────────────────────────────
  const meetings = await prisma.meeting.findMany({
    include: {
      participants: {
        select: { email: true }
      }
    }
  });

  for (const meeting of meetings) {
    const startTime = new Date(meeting.startTime);
    const reminderTime = new Date(startTime.getTime() - 15 * 60 * 1000); // 15 min before

    // check if current time matches reminder time (to the minute)
    if (
      reminderTime.getFullYear() === now.getFullYear() &&
      reminderTime.getMonth() === now.getMonth() &&
      reminderTime.getDate() === now.getDate() &&
      reminderTime.getHours() === now.getHours() &&
      reminderTime.getMinutes() === now.getMinutes()
    ) {
      if (!meeting.reminderSent) {
        console.log(
          `Attempting to send meeting reminder for meeting: ${meeting.title}`
        );
        await sendMeetingReminder(meeting);
        await prisma.meeting.update({
          where: { id: meeting.id },
          data: { reminderSent: true }
        });
      } else {
        console.log(
          `Reminder already sent for meeting: ${meeting.title}. Skipping.`
        );
      }
    }
  }

  console.log("Reminder check completed.");
}

// ───────────────────────────────
// CRON SCHEDULER
// ───────────────────────────────
// Run every minute so we don't miss the "15 min before meeting" slot
nodeCron.schedule(
  "*/1 * * * *",
  () => {
    checkAndSendReminders();
  },
  { timezone: "Asia/Kolkata" }
);

console.log("Scheduler started for project & meeting reminders.");

export { checkAndSendReminders };
