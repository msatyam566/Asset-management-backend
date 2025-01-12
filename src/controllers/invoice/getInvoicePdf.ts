import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

export const getInvoicePdf = async (req: Request, res: Response) => {
  const invoiceId = req.params.id;

  try {
    const getInvoicDetails = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        shop: {
          include: {
            owner: true,
          },
        },
        payment: true,
        customer: true,
        productDetails: true,
      },
    });

    if (!getInvoicDetails) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const invoiceData = {
      shopName: getInvoicDetails.shop.name,
      shopOwnerName: getInvoicDetails.shop.owner.name,
      contactNumber: getInvoicDetails.shop.owner.mobile,
      products: getInvoicDetails.productDetails.map((product) => ({
        name :product.productName,
        quantity: product.quantity,
        price: product.price,
      })),
      totalAmount: getInvoicDetails.totalAmount,
      paymentStatus: "completed",
      paymentMode :getInvoicDetails.payment?.paymentMethod,
      customerName: getInvoicDetails.customer.name,
      customerContact: getInvoicDetails.customer.phone,
    };

    return res.status(200).json({
      message: "invoice fetched successfully",
      data: invoiceData,
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching Invoice", error });
    return error;
  }
};
