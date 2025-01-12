import { Request, Response } from "express";
import prisma from "../../config/prismaClient";
import sendForgotEmail from "../../services/sendForgotEmail";
import crypto from "crypto";

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Find the user in the database
    const findUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!findUser) {
      return res.status(403).send({
        status: false,
        message: "User not found. Please register to login.",
      });
    }

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString("hex");

    // Save the token in the database
    const saveToken = await prisma.resetToken.create({
      data: {
        userId: findUser.id,
        token: crypto
          .createHmac("sha256", process.env.SECRET_KEY || "Alexis@123")
          .update(token)
          .digest("hex"), // Hash the token with a secret key
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes expiration
      },
    });

    // Create the reset password link
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    // Send the reset link to the user's email
    await sendForgotEmail(email, resetLink);

    // Respond to the client
    res.status(200).json({
      success: true,
      message:
        "Link sent to your email. Please click on the link to reset your password.",
    });
  } catch (error: any) {
    res.status(500).json({
      status: false,
      data: error.message,
    });

    return error;
  }
};
