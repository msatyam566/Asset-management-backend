import prisma from "../../config/prismaClient";
import { Request, Response } from "express";
import { generateOTP, sendEmail } from "../../services/sendEmail";
export const generateOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate a 6-digit OTP
    const otp = generateOTP();

    // Set OTP expiration time (5 minutes)
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Update user with OTP and expiration time
    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiresAt },
    });
    await sendEmail(email, otp);
    
    // Respond with the access token and payload
    res.status(200).json({
      success: true,
      message: "OTP sent to your email.",
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json(error);
    return error;
  }
};
