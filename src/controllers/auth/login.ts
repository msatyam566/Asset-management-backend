import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prismaClient";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../services/generateToken";
import { loginValidation } from "../../services/validationSchema";
const config = require("../../config/keys");

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = await loginValidation.validateAsync(req.body);

    // Find the user in the database (can be employees or outlets in the same "User" table)
    const userLogin = await prisma.user.findUnique({
      where: { email },
    });

    if (!userLogin) {
      return res.status(403).send({
        status: false,
        message: "User not found. Please register to login.",
      });
    }

    // Ensure the isVerfieid value is not null
    if (userLogin.isVerified === false) {
      return res.status(403).send({
        status: false,
        message: "Please verify your email with OTP before logging in.",
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

    // Prepare payload for the token
    const payload = {
      role: userLogin.role,
      email: userLogin.email,
      _id: userLogin.id, // Ensure `id` matches your Prisma schema field
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
        userId: userLogin.id,
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
    res.status(422).json({
      status: false,
      message: "validation failed kindly register",
      details: error.details,
    });
    return error;
  }
};
