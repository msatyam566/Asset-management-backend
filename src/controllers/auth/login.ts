import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prismaClient";
import { loginValidation } from "../../services/validationSchema";
import { generateOTP, sendEmail } from "../../services/sendEmail";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = await loginValidation.validateAsync(req.body);

    // Find the user in the database (can be employees or outlets in the same "User" table)
    const userLogin = await prisma.user.findFirst({
      where: { AND: [{ email: email }, { isDeleted: false }] },
    });

    if (!userLogin) {
      return res.status(403).send({
        status: false,
        message: "User not found. Please register to login.",
      });
    }

    // Check if the provided password matches the stored hashed password
    const isMatch = await bcrypt.compare(password, userLogin.password);

    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: "Incorrect password. Please try again.",
      });
    }
    // Generate a 6-digit OTP
    const otp = generateOTP();

    // Set OTP expiration time (5 minutes)
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Update user with OTP and expiration time
    await prisma.user.update({
      where: { email },
      data: { otp, otpExpiresAt },
    });

    // Send the OTP to the user's email
    await sendEmail(email, otp);

    // Respond with the access token and payload
    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Please verify to proceed.",
    });
  } catch (error: any) {
    res.status(422).json({
      status: false,
      message: "validation failed kindly register",
      details: error.details,
    });
    return error;
  }
};
