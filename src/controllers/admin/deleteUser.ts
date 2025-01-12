import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

// Soft Delete User API
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate input
    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role === "SHOPOWNER" && user.shopId) {
  
        await prisma.shop.delete({
          where: {
            id: user?.shopId,
          },
        });

    } 

    // Soft delete the user by setting isDeleted to true
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { isDeleted: true },
    });

    res.status(200).json({
      message: "User deleted successfully.",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error during user soft delete:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the user." });
    return error;
  }
};
