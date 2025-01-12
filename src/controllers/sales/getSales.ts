import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

export const getSales = async (req: Request, res: Response) => {
  const shopId = req.user?.shopId;
  const role = req.user?.role;

  try {
    // If role is admin fetch all sales

    if (role === "ADMIN") {
      const sales = await prisma.sales.findMany({
        include: {
          user: {
            select: {
              name: true,
            },
          },
          shop: {
            select: {
              name: true,
            },
          },
        },
      });

      const totalAmount = await prisma.sales.aggregate({
        _sum: {
          totalAmount: true,
        },
      });


      if (sales.length === 0) {
        return res.status(404).json({ message: "Sales not found" });
      }
      return res.status(200).json({
        message: "Sales fetched successfully",
        data: sales,
        sumTotal : totalAmount._sum.totalAmount || 0,
        totalCount: sales.length,
      });

      // if role is shop owner then we will use shop id to fetch sales related to shop
    }

    if (!shopId) {
      return res.status(404).json({
        message: "Shop not found kindly subscribe or associate a shop with your account",
      });
    }

    // Non-admin users with a valid shopId
    const findShop = await prisma.shop.findUnique({
      where: { id: shopId },
    });

    if (!findShop) {
      return res.status(404).json({ message: "Shop not found" });
    }

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

    const totalAmount = await prisma.sales.aggregate({
      where: {
        shopId: shopId,
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
