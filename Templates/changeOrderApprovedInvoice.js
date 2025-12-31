// Templates/changeOrderInvoiceRequestTemplate.ts

export default function changeOrderInvoiceRequestTemplate(
  projectName,
  changeOrderRef,
  approvedBy,
  approvedOn,
  remarks,
  recipientUsername
) {
  const formattedDate = new Date(approvedOn).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Project Station - Change Order Approved</title>

  <style>
    body {
      font-family: 'Courier New', Courier, monospace;
      background-color: #f2fdf3;
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
    }

    .header-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #6adb45;
      color: white;
      padding: 25px;
      border-radius: 8px;
    }

    .header-title {
      font-size: 24px;
      font-weight: bold;
    }

    .header-logo {
      max-width: 100px;
      height: auto;
    }

    .email-body {
      margin-top: 25px;
      line-height: 1.6;
    }

    .card {
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 20px;
      margin-top: 25px;
    }

    .green-text {
      color: #6adb45;
      font-weight: bold;
    }

    p {
      font-size: 16px;
      color: #555;
    }

    .cta {
      text-align: center;
      margin-top: 25px;
    }

    .cta a {
      background-color: #6adb45;
      color: white;
      padding: 12px 25px;
      border-radius: 5px;
      text-decoration: none;
      font-size: 16px;
      font-weight: bold;
    }

    .footer {
      text-align: center;
      margin-top: 40px;
      font-size: 14px;
      color: #555;
    }

    .footer img {
      max-width: 150px;
      margin-top: 15px;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <div class="header-flex">
      <div class="header-title">
        Change Order Approved<br/>
        <span style="font-size: 16px;">
          Project: <strong>${projectName}</strong>
        </span>
      </div>
      <img
        src="https://firebasestorage.googleapis.com/v0/b/whiteboard-website.appspot.com/o/assets%2Fimage%2Flogo%2Fwhiteboardtec-logo.png?alt=media&token=f73c5257-9b47-4139-84d9-08a1b058d7e9"
        alt="Company Logo"
        class="header-logo"
      />
    </div>

    <div class="email-body">
      <p>Hello <b>${recipientUsername || "PMO Team"}</b>,</p>

      <p>
        This is to inform you that a <b>Change Order has been approved</b> and is now
        ready for <b>invoice processing</b> in Project Station.
      </p>

      <div class="card">
        <p><strong>Project Name:</strong> ${projectName}</p>
        <p><strong>Change Order Reference:</strong> ${changeOrderRef}</p>
        <p>
          <strong>Approved On:</strong>
          <span class="green-text">${formattedDate}</span>
        </p>
        <p>
          <strong>Approved By:</strong>
          ${approvedBy || "Authorized Approver"}
        </p>

        <p><strong>Remarks / Description:</strong></p>
        <p style="white-space: pre-line;">${remarks || "—"}</p>
      </div>

      <p>
        Kindly proceed with <b>raising the invoice</b> for this approved Change Order
        at the earliest. Once invoiced, please update the invoice status in Project Station
        for tracking and audit purposes.
      </p>

      <div class="cta">
        <a href="https://projectstation.whiteboardtec.com">
          Go to Project Station
        </a>
      </div>

      <p style="margin-top: 30px;">
        Thanks & Regards,<br/>
        <b>The Project Station Team</b><br/>
        Bangalore
      </p>
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
</html>`;
}
