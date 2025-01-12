import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";

// Create a Category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const shopId = req.user?.shopId;

    const findShop = await prisma.shop.findUnique({
      where: { id: shopId },
    });
    if (!findShop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        createdById: findShop.id,
      },
    });

    return res
      .status(201)
      .json({ message: "Category added successfully", data: category });
  } catch (error: any) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "Error creating category", error: error.message });
    return error;
  }
};

// Get All Categories by Product
export const getCategories = async (req: Request, res: Response) => {
  const shopId = req.user?.shopId;

  if (!shopId) {
    return res
      .status(404)
      .json({ message: "Shop not found kindly subscribe or associate a shop with your account" });
  }

  try {


    const findShop = await prisma.shop.findUnique({
      where: { id: shopId },
    });
    if (!findShop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const categories = await prisma.category.findMany({
      where: {
        createdById: findShop.id,
      },
    });
    if (categories.length === 0) {
      return res.status(404).json({ message: "Categories not found" });
    }

    return res
      .status(200)
      .json({
        message: "Categories fetched successfully ",
        data: categories,
        totalCount: categories.length,
      });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching categories", error });
    return error;
  }
};

// Update a Category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    return res
      .status(200)
      .json({ message: "Category updated successfully", updatedCategory });
  } catch (error: any) {
    res.status(500).json({ message: "Error updating category", error });
    return error;
  }
};

// Delete a Category  Delete
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id },
    });

    return res.status(200).json({ message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: "Error deleting category", error });
    return error;
  }
};
