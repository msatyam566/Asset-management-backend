import nodemailer from "nodemailer";
const config = require("../config/keys");

const sendForgotEmail = async (email: string[], resetLink: any) => {
  const transporter = nodemailer.createTransport({
    host: config.default.sendEmail.host, // SMTP server hostname
    port: 587, // port
    secure: false,
    auth: {
      user: config.default.sendEmail.user, // email address
      pass: config.default.sendEmail.pass, // password
    },
  });

  const mailOptions = {
    from: config.default.sendEmail.user,
    to: email, // recipient
    subject: "Reset Your Password",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border-radius: 8px;">
      <h2 style="text-align: center; color: #333;">Reset Your Password</h2>
      <p style="font-size: 16px; color: #555;">
        Dear User,
      </p>
      <p style="font-size: 16px; color: #555;">
        We received a request to reset your password. Please find the link below to reset your password. If you did not request this, please ignore this email.
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetLink}" 
          style="background-color: #4CAF50; color: white; text-decoration: none; padding: 12px 20px; font-size: 16px; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="font-size: 14px; color: #555;">
        This link will expire in 5 minutes. If you have any questions, please contact our support team.
      </p>
      <p style="font-size: 14px; color: #555; text-align: center;">Thank you for using our service!</p>
    </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "email sent successfully." };
  } catch (error) {
    console.error("Error sending reset email:", error);
    throw new Error("Failed to send reset email.");
  }
};



export default sendForgotEmail;
