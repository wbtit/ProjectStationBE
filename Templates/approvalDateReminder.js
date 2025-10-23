// Templates/approvalDateReminder.js

export function approvalReminderTemplate(projectName, approvalDate, recipientUsername) {
  // Format the date for better readability in the email
  const formattedDate = new Date(approvalDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Whiteboard Engineering - Project Update</title>

    <style type="text/css">
      /* Global Reset */
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, Helvetica, sans-serif;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        background-color: #f6f7f9;
      }
      table {
        border-spacing: 0;
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }
      td {
        padding: 0;
      }
      img {
        border: 0;
        outline: none;
        text-decoration: none;
        display: block;
        -ms-interpolation-mode: bicubic;
      }
      a {
        text-decoration: none;
        color: #8cc63f;
      }
      .main-content-wrapper {
        max-width: 600px;
        width: 100%;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
      }

      /* Typography */
      .title {
        font-size: 18px;
        font-weight: 600;
        color: #333333;
      }
      .subtitle {
        font-size: 14px;
        color: #555555;
        line-height: 20px;
      }
      .divider {
        background-color: #8cc63f;
        height: 4px;
      }

      /* Mobile Styles */
      @media only screen and (max-width: 600px) {
        .main-content-wrapper {
          width: 100% !important;
        }
        .content-padding {
          padding: 0 20px !important;
        }
        .logo-cell {
          padding: 20px 20px 10px 20px !important;
          text-align: center !important;
        }
        .project-name-cell {
          text-align: center !important;
          padding-top: 5px !important;
        }
        .button-link {
          width: 100% !important;
        }
      }
    </style>
  </head>

  <body style="margin: 0; padding: 0; background-color: #f6f7f9">
    <table align="center" width="100%" bgcolor="#f6f7f9">
      <tr>
        <td align="center" valign="top" style="padding: 30px 10px">
          <table
            class="main-content-wrapper"
            align="center"
            cellpadding="0"
            cellspacing="0"
          >
            <!-- Header -->
            <tr>
              <!-- Left: Logo (30%) -->
              <td
                align="left"
                style="
                  width: 30%;
                  padding: 20px 20px 10px 30px;
                  background-color: #ffffff;
                  vertical-align: middle;
                "
                class="logo-cell"
              >
                <img
                  src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9"
                  alt="Whiteboard Engineering Logo"
                  width="140"
                  style="max-width: 100%; height: auto; display: block"
                />
              </td>

              <!-- Right: Project Name (70%) -->
              <td
                align="right"
                style="
                  width: 70%;
                  padding: 20px 30px 10px 10px;
                  font-family: Arial, sans-serif;
                  font-size: 18px;
                  font-weight: 600;
                  color: #ffffff;
                  background-color: #8cc63f;
                  text-align: left;
                  vertical-align: middle;
                "
                class="project-name-cell"
              >
                ${projectName || "N/A"}
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td colspan="2" class="divider"></td>
            </tr>

            <!-- Body -->
            <tr>
              <td colspan="2" style="padding: 30px 40px">
               
                <h4 style="font-weight: normal;">
                  Hello, <b style="color: #555555;">${
                    recipientUsername || "Project Manager"
                  }</b>!
                </h2>
                <p>This is a friendly reminder about the upcoming <span style="font-weight: bold;">approval deadline</span> for your project on Project Station.</p>
                
                <p><strong style="color: #555555;">Project Name:</strong> ${projectName}</p>
                <p
                  style="
                    margin: 0 0 5px 0;
                    font-size: 15px;
                    color: hsl(150, 98%, 41%);
                  "
                >
                  Scheduled Approval Date: ${
                    formattedDate || new Date().toLocaleDateString()
                  }
                </p>

                <p>Please ensure all necessary information and documentation are finalized and submitted for approval by this date. You can review all project details and update the status by clicking the link below:</p>

                <!-- Button -->
                <p align="center" style="margin: 30px 0 40px 0">
                  <a
                    href="https://projectstation.whiteboardtec.com/"
                    target="_blank"
                    style="
                      background-color: #8cc63f;
                      border: 1px solid #8cc63f;
                      border-radius: 6px;
                      color: #ffffff;
                      display: inline-block;
                      font-size: 14px;
                      font-weight: bold;
                      line-height: 18px;
                      text-align: center;
                      padding: 12px 30px;
                      text-decoration: none;
                      letter-spacing: 0.5px;
                    "
                  >
                    Login With Your Credentials
                  </a>
                </p>

                <p style="margin-top: 30px; font-size: 12px;">If this project has already been approved, please update its status on Project Station to prevent further reminders.</p>

                <!-- Signature -->
                <p style="font-size: 15px; color: #333333; margin-bottom: 10px">
                  Thanks & Regards,
                </p>

                <table border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td valign="top" style="padding-right: 15px">
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9"
                        alt="Sender"
                        width="80"
                        height="auto"
                        style="border-radius: 10%; display: block"
                      />
                    </td>

                    <td valign="middle">
                      <p
                        style="
                          margin: 0;
                          font-size: 16px;
                          font-weight: bold;
                          color: #333333;
                        "
                      >
                       Project Station
                      </p>
                      <p style="margin: 2px 0; font-size: 14px; color: #888888">
                        Your friendly Tracking Application
                      </p>
                      <p style="margin: 2px 0; font-size: 14px; color: #888888">
                        Whiteboard Engineering |
                        <a
                          href="https://whiteboardtec.com/"
                          style="color: #8cc63f"
                          >whiteboardtec.com</a
                        > | <a
                        href="https://projectstation.whiteboardtec.com/"
                        style="color: #8cc63f"
                        >Project Station</a
                      >
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                colspan="2"
                align="center"
                style="padding: 20px 30px 30px 30px; background-color: #f6f7f9"
              >
                <p
                  style="
                    margin: 0;
                    font-size: 12px;
                    color: #aaaaaa;
                    line-height: 18px;
                  "
                >
                  © ${new Date().getFullYear()} Whiteboard Engineering. All
                  Rights Reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>

`;
}