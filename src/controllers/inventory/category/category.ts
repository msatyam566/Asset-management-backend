import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";

// Create a Category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { categoryName, description, createdById } = req.body;

    const category = await prisma.category.create({
      data: {
        categoryName,
        description,
        createdById,
      },
    });

    return res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Error creating category", error });
    return error;
  }
};

// Get All Categories by Product
export const getCategories = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const findShop = await prisma.shop.findUnique({
      where: { ownerId: userId },
    });
    if (!findShop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    const categories = await prisma.category.findMany({
      where: {
        createdById:findShop.id,
      },
    });

    return res
      .status(200)
      .json({ category: categories,shopDetails:findShop, totalCount: categories.length });
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
    const { categoryName, description } = req.body;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        categoryName,
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
  } catch (error) {
    res.status(500).json({ message: "Error deleting category", error });
    return error;
  }
};


export const getCategoriesByStaff = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

   
    const getOwnerId = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const shopId = getOwnerId?.shopId;


    const categories = await prisma.category.findMany({
      where: {
        createdById:shopId,
      },
    });

    return res
      .status(200)
      .json({ category: categories, totalCount: categories.length });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching categories", error });
    return error;
  }
};