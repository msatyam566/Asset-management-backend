import prisma from "../../config/prismaClient"; 
import { Request, Response } from "express";

export const verifyOtp = async (req:Request, res:Response)=> {
    try {
        const { email, otp } = req.body;
  
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: "User not found" });

  
    // Checking if OTP matches and is not expired
    if (
        user.otp !== otp ||
        !user.otpExpiresAt || // Check if otpExpiresAt is null
        new Date() > user.otpExpiresAt
      ) {
        return res.status(400).json({ error: "Invalid or expired OTP." });
      }
  
    await prisma.user.update({
      where: { email },
      data: { otp: null, otpExpiresAt: null, isVerified: true },
    });
  
    res.json({ message: "OTP verified. Login successful." });
    } 
    catch (error:any) {
        res.status(500).json(error)
        return error;
      }
  }
  