import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";



// Delete a product  Delete
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error:any) {
    if (
      error.code === "P2003" // Prisma error code for foreign key constraint
    ) {
      res.status(400).json({
        error:
          "Cannot delete category as it is associated with one or more products.",
      });
    } else {
    res.status(500).json({ message: "Error deleting product", error });
    return error;
  }
}
};