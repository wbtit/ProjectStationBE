export const approvalReminderTemplate = (projectName, approvalDate) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Project Approval Reminder</title>
            <style>
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                    -webkit-font-smoothing: antialiased;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
                }
                .header {
                    background-color: #4CAF50; /* A pleasant green */
                    color: #ffffff;
                    padding: 20px;
                    text-align: center;
                    border-top-left-radius: 12px;
                    border-top-right-radius: 12px;
                }
                .header h1 {
                    margin: 0;
                    font-size: 24px;
                }
                .content {
                    padding: 30px;
                    color: #333333;
                    line-height: 1.6;
                }
                .content p {
                    margin-bottom: 15px;
                }
                .highlight {
                    font-weight: bold;
                    color: #3366cc; /* A nice blue */
                }
                .footer {
                    background-color: #f0f0f0;
                    padding: 20px;
                    text-align: center;
                    color: #777777;
                    font-size: 12px;
                    border-bottom-left-radius: 12px;
                    border-bottom-right-radius: 12px;
                }
                .button-container {
                    text-align: center;
                    margin-top: 25px;
                }
                .button {
                    display: inline-block;
                    padding: 12px 25px;
                    background-color: #4CAF50;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>Approval Date Approaching!</h1>
                </div>
                <div class="content">
                    <p>Dear Project Manager,</p>
                    <p>This is an automated reminder that the **approval date** for project <span class="highlight">${projectName}</span> is **tomorrow**, <span class="highlight">${new Date(approvalDate).toDateString()}</span>.</p>
                    <p>Please ensure all necessary documentation is finalized and approvals are in place to avoid any delays.</p>
                    <div class="button-container">
                        <a href="#" class="button">Review Project Details</a> <!-- Add actual link here -->
                    </div>
                    <p>If you have any questions or require further information, please feel free to reach out.</p>
                    <p>Regards,<br>Your Project Management System</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};