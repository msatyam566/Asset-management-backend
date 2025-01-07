import { Request, Response } from "express";
import prisma from "../../../config/prismaClient";
import generateBarcode from "../../../services/generateBarcode";
import generateSKU from "../../../services/generateSku";

export const createProduct = async (req: Request, res: Response) => {
  try {
    // Destructure the data from the request body
    const { name, quantity, description, tax, price, totalPrice, categoryId } =
      req.body;
    const shopId = req.user?.shopId;

    // Validate that all required fields are present
    if (!name || !quantity || !price || !totalPrice || !categoryId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const parsedQuantity = parseInt(quantity, 10);
    const parsedPrice = parseFloat(price);
    const parsedTotalPrice = parseFloat(totalPrice);

    // Check if the values are valid numbers
    if (
      isNaN(parsedQuantity) ||
      isNaN(parsedPrice) ||
      isNaN(parsedTotalPrice)
    ) {
      return res.status(400).json({ message: "Invalid number format" });
    }

    // Map the tax value from the request body to the corresponding Gst enum
    let gstEnumValue: "GST_28" | "GST_18" | "GST_12" | "GST_20" | undefined;

    switch (tax) {
      case "18":
        gstEnumValue = "GST_18";
        break;
      case "20":
        gstEnumValue = "GST_20";
        break;
      case "12":
        gstEnumValue = "GST_12";
        break;
      case "28":
        gstEnumValue = "GST_28";
        break;
      default:
        return res.status(400).json({ message: "Invalid GST rate" });
    }

    // If no valid GST rate was found, return an error
    if (!gstEnumValue) {
      return res.status(400).json({ message: "Invalid GST rate" });
    }

    // Find the shop based on user ID
    const shop = await prisma.shop.findUnique({ where: { id: shopId } });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Get the product image path from the file

    const productImage = req.file
      ? `${process.env.BACKEND_URL}${req.file.filename}`
      : null;

    const sku = await generateSKU(name);
    await generateBarcode(sku);

    // Create the product in the database
    const product = await prisma.product.create({
      data: {
        name,
        quantity: parsedQuantity,
        description,
        tax: gstEnumValue, // Use the mapped enum value here
        sku: sku,
        barCode: sku,
        price: parsedPrice,
        totalPrice: parsedTotalPrice,
        categoryId,
        productImage,
        createdById: shop.id,
      },
    });

    return res
      .status(201)
      .json({ data: product, message: "Product created successfully" });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
    return error;
  }
};
