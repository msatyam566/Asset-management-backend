import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

export const getProducts = async (req: Request, res: Response) => {
  try {

    const { productName } = req.query;

    const queryOptions: any = {};

    // Add productName filter if provided
    if (productName) {
      queryOptions.productName = {
        contains: productName as string, // Partial match
        mode: "insensitive", // Case-insensitive match
      };
    }


    const getProducts = await prisma.product.findMany({
      where: {
        ...queryOptions,
      },
    });

    if(getProducts.length === 0 ) {
        return res.status(404).json({message: "Product not found"});
    }


    return res.status(200).json({productDetails: getProducts, totalCount: getProducts.length})

  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching categories", error });
    return error;
  }
};
