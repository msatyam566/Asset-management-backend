import { Request, Response, NextFunction } from "express";
import prisma from "../../config/prismaClient";

export const createShopOwner = async (req: Request, res: Response) => {
  try {
    const { userId, name,role } = req.body;

    if (!userId || !name) {
      return res
        .status(400)
        .json({ message: "User ID and Shop Name are required." });
    }

    // Step 2: Fetch the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }


    if (user.role === "SHOPOWNER") {
      return res.status(400).json({ message: "User is already a ShopOwner." });
    }


    const existingShop = await prisma.shop.findUnique({
      where: { ownerId: userId },
    });

    if (existingShop) {
      return res.status(400).json({ message: "This user already owns a shop." });
    }


    const shop = await prisma.shop.create({
      data: {
        name: name,
        ownerId: userId, // Link the shop to the user
      },
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role: role,
        shopId: shop.id, // Link the shop ID to the user
      },
    });
    return res.status(200).json({
      message: "User role and shop created successfully.",
      user: updatedUser,
      shop,
    });

  } catch (error: any) {
    res
      .status(500)
      .json({ message: "An error occurred while fetching users." });
    return error;
  }
};
