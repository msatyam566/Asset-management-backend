import prisma from "../../config/prismaClient";
import { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../services/generateToken";
const config = require("../../config/keys");

export const verifyOtp = async (req: Request, res: Response) => {
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
      data: { otp: null, otpExpiresAt: null },
    });

    // // Prepare payload for the token
    const payload = {
      role: user.role,
      email: user.email,
      _id: user.id, // Ensure `id` matches your Prisma schema field
    };

    // Generate tokens
    const accessToken = generateAccessToken(
      payload,
      config.default.jwt.accessTokenLife
    );
    const refreshToken = generateRefreshToken(
      payload,
      config.default.jwt.refreshTokenLife
    );

    if (!accessToken || !refreshToken) {
      return res.status(500).json({
        status: false,
        message: "Unable to generate tokens. Please try again later.",
      });
    }

    // Ensure tokens are strings
    if (typeof accessToken !== "string" || typeof refreshToken !== "string") {
      return res.status(500).json({
        status: false,
        message: "Unable to generate tokens. Please try again later.",
      });
    }

    // Save the tokens in the database
    await prisma.token.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Adjust expiry as needed
      },
    });



     // Store the refresh token in a cookie
     res.cookie("auth", refreshToken, { httpOnly: true });

     // Respond with the access token and payload
     res.status(200).json({
       success: true,
       accessToken,
       payload: payload,
     });
  } catch (error: any) {
    res.status(500).json(error);
    return error;
  }
};
