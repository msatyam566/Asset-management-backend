import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role, name} = req.query; 

    // Build query options dynamically
    const queryOptions: any = {};

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
        isDeleted: false, 
      },
    });
    

    return res.status(200).json({data: users, totalCount: users.length});
  } catch (error: any) {
     res.status(500).json({ message: "An error occurred while fetching users." });
     return error
  }
};
