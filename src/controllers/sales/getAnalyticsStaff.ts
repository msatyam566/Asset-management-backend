import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

export const getAnalyticsStaff = async (req: Request, res: Response) => {
  const shopId = req.user?.shopId;
  const userId = req.user?.id;

  if (!shopId) {
    return res
      .status(404)
      .json({ message: "Shop not found kindly subscribe or associate a shop with your account" });
  }

  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // Fetch total sales by the staff
    const totalSales = await prisma.sales.aggregate({
      where: { userId },
      _sum: { totalAmount: true },
    });
    // Fetch monthly target of staff
    const userTarget = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        monthlyTarget: true,
      },
    });
    const getMonthlyTarget = userTarget?.monthlyTarget;

    // Fetch monthly sales by the staff
    const monthlySales = await prisma.sales.aggregate({
      where: {
        userId,
        saleDate: { gte: firstDayOfMonth }, // Sales from the first day of the current month
      },
      _sum: { totalAmount: true },
    });

    // Count new users created this month
    const newUsersThisMonth = await prisma.customer.count({
      where: {
        invoices: {
          some: {
            shopId: shopId,
            createdAt: { gte: firstDayOfMonth },
          },
        },
      },
    });

    // Count total orders (invoices) created by the shop
    const totalOrders = await prisma.invoice.count({
      where: { shopId },
    });

    // Count total users till now
    const totalUsers = await prisma.customer.count({
      where: {
        invoices: {
          some: {
            shopId: shopId,
          },
        },
      },
    });

    // Return analytics data
    return res.status(200).json({
      message: "Analytics fetched successfully",
      data: {
        totalSales: totalSales._sum.totalAmount || 0,
        monthlySales: monthlySales._sum.totalAmount || 0,
        newUsersThisMonth,
        totalOrders,
        totalUsers,
        getMonthlyTarget,
      },
    });
  } catch (error: any) {
    console.error("Error fetching analytics:", error.message);
    res
      .status(500)
      .json({ message: "Error fetching analytics", error: error.message });
    return error;
  }
};
