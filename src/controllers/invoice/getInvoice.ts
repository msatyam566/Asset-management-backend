import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

export const getInvoice = async (req: Request, res: Response) => {
  const shopId = req.user?.shopId;
  const role = req.user?.role;


  try {
    // If role is admin fetch all sales

    if (role === "ADMIN") {
      const getInvoice = await prisma.invoice.findMany({
        include: {
          productDetails: true,
          shop: {
            select: {
              name: true,
            },
          },
        },
      });

      if (getInvoice.length === 0) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      return res.status(200).json({
        message: "Invoice fetched successfully",
        data: getInvoice,
        totalCount: getInvoice.length,
      });

    }

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
  

      // if role is shop owner then show according to shop id
   
      const getInvoice = await prisma.invoice.findMany({
        where: {
          shopId: shopId,
        },
        include: {
          productDetails: true,
        },
      });

      if (getInvoice.length === 0) {
        return res.status(404).json({ message: "Invoice not found" });
      }

      return res.status(200).json({
        message: "Invoice fetched successfully",
        data: getInvoice,
        totalCount: getInvoice.length,
      });
    
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching Invoice", error });
    return error;
  }
};
