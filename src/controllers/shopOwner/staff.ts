import { Request, Response } from "express";
import bcrypt from "bcrypt";
import prisma from "../../config/prismaClient"; 
import { registerValidation } from "../../services/validationSchema";

export const addUser = async (
  req: Request,
  res: Response,
) => {
  try {
    const { name, email, password, mobile,role} = await registerValidation.validateAsync(req.body);
    const userId = req.user?.id
    const mobileString = mobile.toString();


    // get the shop id to which this user will link
    const findShop = await prisma.shop.findUnique({
      where: {  ownerId: userId },
    });
    if (!findShop) {
      return res.status(404).json({ message: "Shop not found" });
    }

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

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        mobile:mobileString,
        shopId:findShop.id,
        isDeleted: false,
      },
    });


    return res.status(201).json({
      success: true,
      message: "staff added to your shop successfully.",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        mobile:newUser.mobile,
        shopId : newUser.shopId,
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




// Delete a user  Delete
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error:any) {
    res.status(500).json({ message: "Error deleting user", error });
    return error;
  }
};

// Get all staff
export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const { role, name } = req.query;
    const userId = req.user?.id

    // Build query options dynamically
    const queryOptions: any = {};


    const findShop = await prisma.shop.findUnique({
      where: {  ownerId: userId },
    });
    if (!findShop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Add role filter if provided
    if (role) {
      queryOptions.role = (role as string).toUpperCase(); // Ensure role matches enum case sensitivity
    }

    // Add name filter if provided
    if (name) {
      queryOptions.name = {
        contains: name as string, // Partial match
        mode: "insensitive", // Case-insensitive match
      };
    }

    // Fetch users with filters
    const users = await prisma.user.findMany({
      where: {
        ...queryOptions,
        shopId: findShop.id,
        isDeleted: false,
      },
    });

    return res.status(200).json({ data: users, totalCount: users.length });
  } catch (error:any) {
    res.status(500).json({ error});
    return error;
  }
};
