import prisma from "../../config/prismaClient";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Request, Response } from "express";

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    // Hash the incoming token to match the stored hashed token
    const hashedToken = crypto
      .createHmac("sha256", process.env.SECRET_KEY || "Alexis@123")
      .update(token)
      .digest("hex");

    // Check if the token exists in the database
    const tokenRecord = await prisma.resetToken.findFirst({
      where: {
        token: hashedToken,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!tokenRecord) {
      return res.status(400).json({
        success: false,
        message: "Token has expired or is invalid.",
      });
    }
    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database
    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { password: hashedPassword },
    });

    // Delete the token after successful password reset
    await prisma.resetToken.delete({
      where: { id: tokenRecord.id },
    });

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
    return error;
  }
};
