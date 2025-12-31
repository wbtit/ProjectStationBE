// Templates/ifcCompletionInvoiceTemplate.js

export function ifcCompletionInvoiceTemplate(project, fabricator) {

  const formattedDate = project.endDate
    ? new Date(project.endDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Whiteboard Engineering - IFC Completion</title>

  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
      background-color: #f6f7f9;
    }
    table {
      border-collapse: collapse;
    }
    img {
      border: 0;
      display: block;
    }
    .main-content-wrapper {
      max-width: 600px;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
    }
    .divider {
      background-color: #8cc63f;
      height: 4px;
    }
    @media only screen and (max-width: 600px) {
      .main-content-wrapper {
        width: 100% !important;
      }
    }
  </style>
</head>

<body>
<table align="center" width="100%" bgcolor="#f6f7f9">
  <tr>
    <td align="center" style="padding: 30px 10px">
      <table class="main-content-wrapper" width="100%">

        <!-- Header -->
        <tr>
          <td style="padding: 20px 30px;">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media"
              alt="Whiteboard Engineering"
              width="140"
            />
          </td>
        </tr>

        <!-- Divider -->
        <tr>
          <td class="divider"></td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding: 30px 40px; color: #333333;">

            <h3 style="margin-top: 0;">
              IFC Stage Completed — Final Invoice Action Required
            </h3>

            <p>
              This is to formally notify you that the
              <strong>IFC (Issued For Construction) stage</strong>
              for the following project has been
              <strong>successfully completed</strong>.
            </p>

            <p>
              Please proceed with the
              <strong>final invoice generation</strong>
              in accordance with the agreed scope and commercial terms.
            </p>

            <table cellpadding="6" cellspacing="0" style="margin: 20px 0; font-size: 14px;">
              <tr>
                <td><strong>Project Name:</strong></td>
                <td>${project.name}</td>
              </tr>
              <tr>
                <td><strong>Fabricator:</strong></td>
                <td>${fabricator?.fabName || "N/A"}</td>
              </tr>
              
            </table>

            <p>
              All project deliverables for IFC have been completed and verified
              in <strong>Project Station</strong>.
            </p>

            <!-- Button -->
            <p align="center" style="margin: 30px 0;">
              <a
                href="https://projectstation.whiteboardtec.com/"
                target="_blank"
                style="
                  background-color: #8cc63f;
                  color: #ffffff;
                  padding: 12px 28px;
                  border-radius: 6px;
                  font-size: 14px;
                  font-weight: bold;
                  text-decoration: none;
                  display: inline-block;
                "
              >
                Open Project Station
              </a>
            </p>

            <p style="font-size: 13px; color: #666666;">
              This is an automated notification triggered after IFC completion.
              No further technical actions are required in the system once the
              final invoice is raised.
            </p>

            <!-- Signature -->
            <p style="margin-top: 30px;">
              Thanks & Regards,<br/>
              <strong>Project Station</strong><br/>
              Whiteboard Engineering
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td align="center" style="padding: 20px; background-color: #f6f7f9;">
            <p style="font-size: 12px; color: #aaaaaa; margin: 0;">
              © ${new Date().getFullYear()} Whiteboard Engineering. All Rights Reserved.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
