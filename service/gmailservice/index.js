import { transporter } from "../../src/config/mailconfig.js";

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const info = await transporter.sendMail({
      from: "wbt.itdev@gmail.com", // Sender info
      to, // List of receivers
      subject, // Subject line
      text, // Plain text body
      html, // HTML body (optional)
    });
    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export { sendEmail };
