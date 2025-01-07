import jwt from "jsonwebtoken";
import createError from "http-errors";
import prisma from "../config/prismaClient";
import { Request, Response, NextFunction } from "express";

interface DecodedPayload {
  _id: string;
  email: string;
  role: string;
  shopId: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        shopId: string;
      };
    }
  }
}

const config = require("../config/keys");

const validateAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(
        createError.Unauthorized(
          "Authorization header missing. Please login again."
        )
      );
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer"

    if (!token) {
      return next(
        createError.Unauthorized("Access token is missing. Please login again.")
      );
    }

    jwt.verify(
      token,
      config.default.jwt.accessSecret,
      async (err: any, decoded: any) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            const refreshToken = req.cookies?.auth;

            if (!refreshToken) {
              return next(
                createError.Unauthorized("Session expired. Please login again.")
              );
            }

            try {
              const refreshPayload = jwt.verify(
                refreshToken,
                config.default.jwt.refreshSecret
              ) as DecodedPayload;

              // Check if refresh token exists in the database
              const tokenRecord = await prisma.token.findFirst({
                where: { token: refreshToken },
                include: { user: true },
              });

              if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
                return next(
                  createError.Unauthorized(
                    "Session expired. Please login again."
                  )
                );
              }

              // Generate new access and refresh tokens
              const newAccessToken = jwt.sign(
                {
                  _id: refreshPayload._id,
                  email: refreshPayload.email,
                  role: refreshPayload.role,
                  shopId: refreshPayload.shopId,
                },
                config.default.jwt.accessSecret,
                { expiresIn: "3d" }
              );

              const newRefreshToken = jwt.sign(
                {
                  _id: refreshPayload._id,
                  email: refreshPayload.email,
                  role: refreshPayload.role,
                  shopId :refreshPayload.shopId
                },
                config.default.jwt.refreshSecret,
                { expiresIn: "7d" }
              );

              // Update refresh token in the database
              await prisma.token.update({
                where: { id: tokenRecord.id },
                data: {
                  token: newRefreshToken,
                  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                },
              });

              // Send the new refresh token as a cookie
              res.cookie("auth", newRefreshToken, { httpOnly: true });
              res.json({ accessToken: newAccessToken });

              req.user = {
                id: refreshPayload._id,
                email: refreshPayload.email,
                role: refreshPayload.role,
                shopId: refreshPayload.shopId,
              };
              return next();
            } catch (error) {
              console.error("Error during refresh token validation:", error);
              return next(
                createError.Unauthorized("Session expired. Please login again.")
              );
            }
          }

          return next(createError.Unauthorized("Invalid token."));
        }

        // Assign decoded payload to `req.user`
        const decodedPayload = decoded as DecodedPayload;
        req.user = {
          id: decodedPayload._id,
          email: decodedPayload.email,
          role: decodedPayload.role,
          shopId: decodedPayload.shopId,
        };
        next();
      }
    );
  } catch (error) {
    console.error("Error in validateAccessToken", error);
    return next(createError.InternalServerError("Internal server error."));
  }
};

export default validateAccessToken;
