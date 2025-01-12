import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

export const getSalesStaff = async (req: Request, res: Response) => {
  const shopId = req.user?.shopId;
  if (!shopId) {
    return res.status(404).json({
      message: "Shop not found kindly subscribe or associate a shop with your account",
    });
  }
  try {
    const userId = req.user?.id;

    const getSales = await prisma.sales.findMany({
      where: {
        userId: userId,
      },
    });

    const totalAmount = await prisma.sales.aggregate({
      where: {
        userId: userId,
      },
      _sum: {
        totalAmount: true,
      },
    });
    if (getSales.length === 0) {
      return res.status(404).json({ message: "Sales not found" });
    }
    return res.status(200).json({
      message: "Sales fetched successfully",
      data: getSales,
      sumTotal : totalAmount._sum.totalAmount || 0,
      totalCount: getSales.length,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching Sales", error });
    return error;
  }
};
