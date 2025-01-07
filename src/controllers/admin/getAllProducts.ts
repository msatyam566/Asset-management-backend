import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

export const getProducts = async (req: Request, res: Response) => {
  try {

    const { name } = req.query;

    const queryOptions: any = {};

    // Add productName filter if provided
    if (name) {
      queryOptions.name = {
        contains: name as string, // Partial match
        mode: "insensitive", // Case-insensitive match
      };
    }


    const getProducts = await prisma.product.findMany({
      where: {
        ...queryOptions,
      },
    });

    if(getProducts.length === 0 ) {
        return res.status(404).json({message: "Products not found"});
    }


    return res.status(200).json({message:"Products fetched successfully", data: getProducts, totalCount: getProducts.length})

  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching Products", error });
    return error;
  }
};
