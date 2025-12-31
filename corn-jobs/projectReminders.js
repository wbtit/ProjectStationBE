import nodeCron from "node-cron";
import prisma from "../src/lib/prisma.js";
import sendApprovalReminder from "../service/gmailservice/sendApprovalReminder.js";
import sendSubmissionReminder from "../service/gmailservice/sendSubmiissionReminder.js";

export async function runProjectReminders() {
  console.log("[CRON] Project reminders running...");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const projects = await prisma.project.findMany();

  for (const project of projects) {

    // Approval Reminder (1 day before)
    const approvalDate = new Date(project.approvalDate);
    approvalDate.setDate(approvalDate.getDate() - 1);
    approvalDate.setHours(0, 0, 0, 0);

    if (
      approvalDate.getTime() === today.getTime() &&
      !project.mailReminder
    ) {
      await sendApprovalReminder(project);
    }

    // Submission Reminder (1 day before)
    const submissionDate = new Date(project.endDate);
    submissionDate.setDate(submissionDate.getDate() - 1);
    submissionDate.setHours(0, 0, 0, 0);

    if (
      submissionDate.getTime() === today.getTime() &&
      !project.submissionMailReminder
    ) {
      await sendSubmissionReminder(project);
    }
  }
}

// Daily at 12:00 AM IST
// nodeCron.schedule(
//   "0 0 * * *",
//   () => runProjectReminders(),
//   { timezone: "Asia/Kolkata" }
// );
// TEMP: every 1 minute for testing
nodeCron.schedule(
  "*/1 * * * *",
  () => runProjectReminders(),
  { timezone: "Asia/Kolkata" }
);
