import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

export const getInvoice = async (req: Request, res: Response) => {
  try {
    const shopId = req.user?.shopId;
    const role = req.user?.role;

    // If role is admin fetch all sales

    if (role === "ADMIN") {
      const getInvoice = await prisma.invoice.findMany({
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

      // if role is shop owner then show according to shop id

    } else {
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
    }
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching Invoice", error });
    return error;
  }
};
