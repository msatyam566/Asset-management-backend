import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { role, name,shopId} = req.query; 

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

    if (shopId) {
      queryOptions.shopId = shopId as string;
    }

    // Fetch users with filters
    const users = await prisma.user.findMany({
      where: {
        ...queryOptions, 
        isDeleted: false, 
        NOT: { role: { in: ["ADMIN"] } },
      },
      include:{
        shop:{
          select:{
            name:true
          }
        }
      }
    });

    

    return res.status(200).json({message:"Users fetched successfully",data: users, totalCount: users.length});
  } catch (error: any) {
    console.log(error);
     res.status(500).json({ message: "An error occurred while fetching users." });
     return error
  }
};
