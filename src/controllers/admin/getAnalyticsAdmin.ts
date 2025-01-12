import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

export const getAnalyticsAdmin = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are 0-based
    const currentYear = currentDate.getFullYear();

    // Total Shop Owners
    const totalShopOwners = await prisma.shop.count();

    // Shop Owners Joined This Month
    const monthlyJoinedShopOwners = await prisma.shop.count({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-${currentMonth}-01`),
          lt: new Date(`${currentYear}-${currentMonth + 1}-01`),
        },
      },
    });

    // Shop Owners Joined This Year
    const yearlyJoinedShopOwners = await prisma.shop.count({
      where: {
        createdAt: {
          gte: new Date(`${currentYear}-01-01`),
          lt: new Date(`${currentYear + 1}-01-01`),
        },
      },
    });

    // Average Monthly Shop Owner Growth
    const monthsElapsed = currentMonth; // Months elapsed in the current year
    const averageMonthlyGrowth = yearlyJoinedShopOwners / monthsElapsed;

    // Response Data
    return res.status(200).json({
      message: "Admin analytics fetched successfully",
      data: {
        totalShopOwners,
        monthlyJoinedShopOwners,
        yearlyJoinedShopOwners,
        averageMonthlyGrowth: averageMonthlyGrowth.toFixed(2), // Rounded to 2 decimal places
      },
    });
  } catch (error: any) {
    console.error("Error fetching admin analytics:", error.message);
    res.status(500).json({
      message: "Error fetching admin analytics",
      error: error.message,
    });
    return error;
  }
};
