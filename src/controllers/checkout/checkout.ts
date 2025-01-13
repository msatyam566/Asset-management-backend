import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

export const handleCheckout = async (req: Request, res: Response) => {
  const shopId = req.user?.shopId;
  const userId = req.user?.id;
  const {
    productDetails,
    paymentId,
    customerName,
    customerPhone,
    totalAmount,
  } = req.body;

  try {
    // Validate payment details
    const findPaymentDetails = await prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!findPaymentDetails) {
      return res.status(400).json({
        success: false,
        message: "Payment not completed. Please make the payment first.",
      });
    }

    // Validate shop existence
    const findShop = await prisma.shop.findUnique({
      where: { id: shopId },
    });
    if (!findShop) {
      return res.status(400).json({
        success: false,
        message: "Shop not found.",
      });
    }

    // Add or update customer record
    const customer = await prisma.customer.upsert({
      where: { phone: customerPhone },
      create: {
        name: customerName,
        phone: customerPhone,
        totalSpent: totalAmount,
      },
      update: {
        name: customerName, // Update the name in case it changes
        totalSpent: {
          increment: totalAmount,
        },
      },
    });

    if (!customer) {
      return res.status(400).json({
        success: false,
        message: "Failed in adding customer",
      });
    }

    // Generate invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-${Date.now()}`,
        shopId: findShop.id,
        invoiceDate: new Date(),
        totalAmount: totalAmount,
        paymentId: findPaymentDetails.id,
        customerId: customer.id,
        productDetails: {
          create: productDetails.map((product: any) => ({
            productId: product.productId,
            productName: product.productName,
            quantity: product.quantity,
            price: product.price,
            totalPrice: product.totalPrice,
          })),
        },
      },
    });

    // Process products for inventory update and sales record creation
    let totalSalesAmount = 0;

    await Promise.all(
      productDetails.map(async (product: any) => {
        const currentProduct = await prisma.product.findUnique({
          where: { id: product.productId },
          select: { price: true, quantity: true },
        });

        if (!currentProduct) {
          throw new Error(`Product with ID ${product.productId} not found.`);
        }

        // Calculate updated quantity and total price for inventory
        const updatedQuantity = currentProduct.quantity - product.quantity;
        const updatedTotalPrice = updatedQuantity * currentProduct.price;

        // Update inventory
        const updateInventory = await prisma.product.update({
          where: { id: product.productId },
          data: {
            quantity: updatedQuantity,
            totalPrice: updatedTotalPrice,
          },
        });

        if (!updateInventory) {
          throw new Error("Failed to update inventory.");
        }

        // Create a sales record for the product
        await prisma.sales.create({
          data: {
            salesNumber :`SAL-${Date.now()}`,
            productId: product.productId as string,
            shopId: shopId as string,
            userId: userId as string,
            quantity: product.quantity,
            totalAmount: product.totalPrice,
            saleDate: new Date(),
          },
        });

        // Accumulate total sales amount for this checkout
        totalSalesAmount += product.totalPrice;

        // Update user's total sales
        await prisma.user.update({
          where: { id: userId },
          data: {
            totalSales: {
              increment: totalSalesAmount, // Increment the totalSales field by the total sales amount
            },
          },
        });
      })
    );

    res.status(200).json({
      success: true,
      message: "Checkout successful. Invoice generated successfully.",
      invoice,
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again.",
      error: error.message,
    });
    return error;
  }
};
