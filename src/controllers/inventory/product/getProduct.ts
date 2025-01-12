import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";

export const getProducts = async (req: Request, res: Response) => {
  const shopId = req.user?.shopId || null;
  const role = req.user?.role;

  try {
    // Admin Role: Fetch all products
    if (role === "ADMIN") {
      const products = await prisma.product.findMany({
        include: {
          createdBy: {
            select: {
              name: true,
            },
          },
        },
      });

      if (products.length === 0) {
        return res.status(404).json({ message: "No products found" });
      }

      return res.status(200).json({
        message: "Products fetched successfully",
        data: products,
        totalCount: products.length,
      });
    }

    // If no shopId is provided, handle guest users
    if (!shopId) {
      return res
        .status(404)
        .json({
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

    const products = await prisma.product.findMany({
      where: {
        createdById: findShop.id,
      },
      include: {
        createdBy: true,
      },
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this shop" });
    }

    return res.status(200).json({
      message: "Products fetched successfully",
      data: products,
      totalCount: products.length,
    });
  } catch (error: any) {
    console.error(error.message);
     res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
      return error

  }
};
