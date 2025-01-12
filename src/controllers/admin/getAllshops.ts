import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

export const getAllshops = async (req: Request, res: Response) => {
  try {
    // Fetch users with filters
    const shops = await prisma.shop.findMany();

    return res
      .status(200)
      .json({
        message: "Shops fetched successfully",
        data: shops,
        totalCount: shops.length,
      });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching shops." });
    return error;
  }
};

export const getShopById = async (req: Request, res: Response) => {
  try {
    const id = req.user?.shopId;

    const shop = await prisma.shop.findUnique({
      where:{id}
    });

    return res
      .status(200)
      .json({
        message: "Shops fetched successfully",
        data: shop,
      });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching shops." });
    return error;
  }
};
