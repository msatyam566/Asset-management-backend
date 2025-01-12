import prisma from "../../../config/prismaClient";
import { Request, Response } from "express";


export const addStockQuantity = async (req: Request, res: Response) => {
  try {
    const { inQuantity, outQuantity } = req.body;
    const productId = req.params.id;

    // Validate input
    if (!productId || (!inQuantity && !outQuantity)) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    // Fetch the product by ID
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Calculate the new quantity
    const updatedQuantity =
      product.quantity + (inQuantity || 0) - (outQuantity || 0);

    if (updatedQuantity < 0) {
      return res
        .status(400)
        .json({ message: "Insufficient stock to deduct outQuantity" });
    }

    // Calculate the new total price
    const updatedTotalPrice = updatedQuantity * product.price;

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        quantity: updatedQuantity,
        totalPrice: updatedTotalPrice,
      },
    });

    return res.status(200).json({
      message: "Quantity added successfully",
      data: updatedProduct,
    });
  } catch (error:any) {
    console.error("Error updating product quantity:", error);
     res.status(500).json({ message: "Internal server error" });
     return error
  }
};
