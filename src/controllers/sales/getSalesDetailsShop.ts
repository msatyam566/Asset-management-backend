import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

export const getShopOwnerAnalytics = async (req: Request, res: Response) => {
  try {
    const shopId = req.user?.shopId;

    // Total Sales Revenue
    const totalSalesRevenue = await prisma.sales.aggregate({
      where: { shopId },
      _sum: { totalAmount: true },
    });

    // Monthly Sales Revenue
    const currentMonth = new Date().getMonth() + 1; // Months are 0-based
    const currentYear = new Date().getFullYear();
    const monthlySalesRevenue = await prisma.sales.aggregate({
      where: {
        shopId,
        saleDate: {
          gte: new Date(`${currentYear}-${currentMonth}-01`),
          lt: new Date(`${currentYear}-${currentMonth + 1}-01`),
        },
      },
      _sum: { totalAmount: true },
    });

    // Total Orders
    const totalOrders = await prisma.invoice.count({
      where: { shopId },
    });

    // New Customers This Month
    const newCustomersThisMonth = await prisma.customer.count({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-${currentMonth}-01`),
          lt: new Date(`${currentYear}-${currentMonth + 1}-01`),
        },
      },
    });

    // Total Customers
    const totalCustomers = await prisma.customer.count();

    // Response Data
    return res.status(200).json({
      message: "Shop owner analytics fetched successfully",
      data: {
        totalSalesRevenue: totalSalesRevenue._sum.totalAmount || 0,
        monthlySalesRevenue: monthlySalesRevenue._sum.totalAmount || 0,
        totalOrders,
        newCustomersThisMonth,
        totalCustomers,
      },
    });
  } catch (error: any) {
    console.error("Error fetching shop owner analytics:", error.message);
     res.status(500).json({
      message: "Error fetching shop owner analytics",
      error: error.message,
    });
    return error
  }

};
