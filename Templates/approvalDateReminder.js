// Templates/approvalDateReminder.js

export function approvalReminderTemplate(projectName, approvalDate, recipientUsername) {
  // Format the date for better readability in the email
  const formattedDate = new Date(approvalDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Project Station - Approval Reminder</title>
    <style>
      body {
        font-family: 'Courier New', Courier, monospace;
        background-color: #f2fdf3; /* Light greenish background */
        color: #333;
        margin: 0;
        padding: 0;
      }

      .email-container {
        background-color: #ffffff;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        border-radius: 10px;
        padding: 35px;
        margin-top: 50px;
        max-width: 650px;
        margin-left: auto;
        margin-right: auto;
        text-align: center; /* Center content within container */
      }

      .header-flex { /* New class for flexbox in header */
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #6adb45;
        color: white;
        padding: 25px;
        border-radius: 8px;
        text-align: left; /* Keep text left-aligned within header flex item */
      }

      .header-title {
        font-size: 26px;
        font-weight: bold;
        margin: 0;
      }

      .header-logo {
        max-width: 100px; /* Adjust as needed */
        height: auto;
      }

      .email-body {
        margin-top: 25px;
        text-align: left; /* Align text within body to left */
        line-height: 1.6;
      }

      .card {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 25px;
        margin-top: 30px;
        border: none;
      }

      .footer {
        text-align: center;
        margin-top: 40px;
        font-size: 14px;
        color: #555;
      }

      .footer img {
        max-width: 150px;
        display: block; /* Make it a block element to center with margin auto */
        margin-left: auto;
        margin-right: auto;
        margin-top: 15px; /* Add some space above the footer logo */
      }

      a {
        color: #6adb45;
        text-decoration: none;
        font-weight: bold;
      }

      .green-text {
        color: #6adb45;
      }

      h2 {
        font-size: 20px;
        color: #333;
        margin-top: 20px;
      }

      p {
        font-size: 16px;
        color: #555;
      }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header-flex">
            <div class="header-title">
                <span>Project Approval Reminder</span><br/>
                <span><strong>Project:</strong> ${projectName}</span>
            </div>
            <div>
                <img
                    src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9"
                    alt="Company Logo"
                    class="header-logo" />
            </div>
        </div>
        <div class="email-body">
            <h2>Hello, <b>${recipientUsername || 'Project Manager'}</b>!</h2>
            <p>This is a friendly reminder about the upcoming **approval deadline** for your project on Project Station.</p>

            <p><strong>Project Name:</strong> ${projectName}</p>
            <p><strong>Scheduled Approval Date:</strong> <span class="green-text">${formattedDate}</span></p>

            <p>Please ensure all necessary information and documentation are finalized and submitted for approval by this date. You can review all project details and update the status by clicking the link below:</p>

            <p style="text-align: center; margin-top: 20px;">
                <a href="projectstation.whiteboardtec.com" style="background-color: #6adb45; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-size: 16px; font-weight: bold;">
                    Go to Project Station
                </a>
            </p>

            <p style="margin-top: 30px;">If this project has already been approved, please update its status on Project Station to prevent further reminders.</p>

            <p>Thanks & Regards,</p>
            <p><b>The Project Station Team</b></p>
            <p>Bangalore</p>
        </div>

        <div class="footer">
            <img
                src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9"
                alt="Company Logo"
            />
            <p><b>Whiteboard Technologies Pvt. Ltd.</b></p>
            <p>Bangalore</p>
        </div>
    </div>
</body>
</html>
`;
}