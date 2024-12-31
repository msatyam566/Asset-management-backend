import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../../config/prismaClient"; // Adjust the import path to your Prisma instance
import { registerValidation } from "../../services/validationSchema";

export const registerUser = async (
  req: Request,
  res: Response,
) => {
  try {
    const { name, email, password, mobile,role} = await registerValidation.validateAsync(req.body);
    const mobileString = mobile.toString();

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    const existingUserPhone = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserPhone) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        mobile:mobileString,
        role:role,
        isDeleted: false,
      },
    });


    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        mobile:newUser.mobile,
        role: newUser.role,
      },
    });
  } catch (error:any) {
    console.log(error)
    res.status(422).json({
        status: false,
        message: "Validation Error",
        details: error.details,
      });
    return error;
  }
};
