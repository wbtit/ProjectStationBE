export const submissionReminderTemplate = (projectName, submissionDate) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Project Submission Reminder</title>
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
                    background-color: #FFA726; /* A warning orange */
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
                    color: #d35400; /* A darker orange */
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
                    background-color: #FFA726;
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
                    <h1>Submission Deadline Tomorrow!</h1>
                </div>
                <div class="content">
                    <p>Dear Project Manager,</p>
                    <p>This is an automated reminder that the **submission deadline** for project <span class="highlight">${projectName}</span> is **tomorrow**, <span class="highlight">${new Date(submissionDate).toDateString()}</span>.</p>
                    <p>Kindly ensure all final deliverables are prepared and submitted on time.</p>
                    <div class="button-container">
                        <a href="#" class="button">Go to Submission Portal</a> <!-- Add actual link here -->
                    </div>
                    <p>Please let us know if you encounter any issues or require assistance.</p>
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