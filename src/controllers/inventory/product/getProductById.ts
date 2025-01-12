import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";

export const getProductById = async (req: Request, res: Response) => {
  try {
    const  id  = req.params.id;

    // Validate the ID
    if (!id) {
      return res.status(400).json({ message: "Product ID is required." });
    }

    // Fetch the user by ID
    const product = await prisma.product.findUnique({
      where: { id },
    });

    // If product not found
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Return the product
    return res.status(200).json({ message:"Product fetched successfully",data :product});
  } catch (error: any) {
    console.log(error.message);
     res.status(500).json({ message: "An error occurred while fetching the product." });
     return error;
  }
};
