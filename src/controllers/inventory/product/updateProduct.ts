import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";
import generateBarcode from "../../../services/generateBarcode";
import generateSKU from "../../../services/generateSku";

export const updateProduct = async (req: Request, res: Response) => {
  try {
    // Get the product ID from the request parameters
    const { id } = req.params;

    // Destructure the data from the request body
    const { name, quantity, description, tax, price, totalPrice, categoryId } =
      req.body;
    const shopId = req.user?.shopId;

    // Validate that the productId is provided
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Validate that at least one field to update is provided
    if (!name && !quantity && !description && !tax && !price && !totalPrice && !categoryId) {
      return res.status(400).json({ message: "No fields to update provided" });
    }

    const parsedQuantity = parseInt(quantity, 10);
    const parsedPrice =  parseFloat(price);
    const parsedTotalPrice =  parseFloat(totalPrice)

    // Check if the values are valid numbers (if provided)
    if (
      (quantity && isNaN(parsedQuantity)) ||
      (price && isNaN(parsedPrice)) ||
      (totalPrice && isNaN(parsedTotalPrice))
    ) {
      return res.status(400).json({ message: "Invalid number format" });
    }

   
    

    // Validate the shop exists
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Validate the product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: id },
    });
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Get the product image path from the file (if provided)
    const productImage = Array.isArray(req.files)
    ? req.files.map((file) => `${process.env.BACKEND_URL}/${file.filename}`)
    : [];
    
    let updatedSku: string | undefined;

    // Regenerate SKU and barcode if the name is updated or sku is not same
    if (existingProduct.name !== name) {
      updatedSku = await generateSKU(name);
      await generateBarcode(updatedSku);
    }

    // Update the product in the database
    const updatedProduct = await prisma.product.update({
      where: { id: id },
      data: {
        ...(name && { name }),
        ...(parsedQuantity !== undefined && { quantity: parsedQuantity }),
        ...(description && { description }),
        ...(tax && { tax: tax }),
        ...(updatedSku && { sku: updatedSku, barCode: updatedSku }),
        ...(parsedPrice !== undefined && { price: parsedPrice }),
        ...(parsedTotalPrice !== undefined && { totalPrice: parsedTotalPrice }),
        ...(categoryId && { categoryId }),
        ...(productImage && { productImage }),
      },
    });

    return res
      .status(200)
      .json({ data: updatedProduct, message: "Product updated successfully" });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
    return error;
  }
};
