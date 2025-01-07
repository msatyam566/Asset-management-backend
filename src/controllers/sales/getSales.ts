import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

export const getSales = async (req: Request, res: Response) => {
  try {
    const shopId = req.user?.shopId;
    const role = req.user?.role;

    // If role is admin fetch all sales

    if (role === "ADMIN") {
      const sales = await prisma.sales.findMany({
        include: {
          user: {
            select: {
              name: true, 
            },
          },
        },
      });
      if (sales.length === 0) {
        return res.status(404).json({ message: "Sales not found" });
      }
      return res.status(200).json({
        message: "Sales fetched successfully",
        data: sales,
        totalCount: sales.length,
      });

      // if role is shop owner then we will use shop id to fetch sales related to shop
    } else {
      const getSales = await prisma.sales.findMany({
        where: {
          shopId: shopId,
        },
        include: {
          user: {
            select: {
              name: true, 
            },
          },
        },
      });
      if (getSales.length === 0) {
        return res.status(404).json({ message: "Sales not found" });
      }
      return res.status(200).json({
        message: "Sales fetched successfully",
        data: getSales,
        totalCount: getSales.length,
      });
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching Sales", error });
    return error;
  }
};
