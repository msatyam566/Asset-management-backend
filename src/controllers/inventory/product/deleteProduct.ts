import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";



// Delete a product  Delete
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const relatedDetails = await prisma.productDetail.findMany({
      where: { productId:id },
    });
    
    if (relatedDetails.length > 0) {
      return res.status(400).json({
        message: 'Cannot delete product. Related details associated with invoice.',
      });
    }
    

    await prisma.product.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error:any) {
    
    res.status(500).json({ message: "Error deleting product", error });
    return error;
  
}
};