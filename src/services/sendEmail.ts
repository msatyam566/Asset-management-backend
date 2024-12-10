import nodemailer from 'nodemailer';
const config = require("../config/keys");

const sendEmail = async (email: string[], otp: any) => {
console.log(email,otp)
  const transporter = nodemailer.createTransport({
    host: config.default.sendEmail.host, // SMTP server hostname
    port: 587, // port
    secure: false,
    auth: {
      user: config.default.sendEmail.user, // email address
      pass: config.default.sendEmail.pass // password
    }
  });

  const mailOptions = {
    from: config.default.sendEmail.user,
    to: email,           // recipient
    subject: 'Verification email',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7f7f7; border-radius: 8px;">
      <h2 style="text-align: center; color: #333;">Your OTP Code</h2>
      <p style="text-align: center; font-size: 18px;">Dear User,</p>
      <p style="font-size: 16px; color: #555;">
        We received a request to send you a One-Time Password (OTP) for your account. Please use the OTP below to login
      </p>
      <h3 style="text-align: center; font-size: 30px; font-weight: bold; color: #4CAF50;">
        ${otp}
      </h3>
      <p style="font-size: 14px; color: #555;">This OTP will expire in 5 minutes. If you did not request this, please ignore this email.</p>
      <p style="font-size: 14px; color: #555; text-align: center;">Thank you for using our service!</p>
    </div>
  `,  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'email sent successfully.' };
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw new Error('Failed to send reset email.');
  }
};

const generateOTP = () => {
  var digits = "0123456789";
  var otpLength = 6;
  var otp = "";
  for (let i = 1; i <= otpLength; i++) {
    var index = Math.floor(Math.random() * digits.length);
    otp = otp + digits[index];
  }
  return otp;
};

export { sendEmail, generateOTP };
