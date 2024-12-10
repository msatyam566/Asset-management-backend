import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

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
