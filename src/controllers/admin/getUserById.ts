import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

export const getUserById = async (req: Request, res: Response) => {
  try {
    const  id  = req.user?.id;

    // Validate the ID
    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Fetch the user by ID
    const user = await prisma.user.findUnique({
      where: { id },
    });

    // If user not found
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return the user
    return res.status(200).json({ data :user});
  } catch (error: any) {
    console.log(error.message);
     res.status(500).json({ message: "An error occurred while fetching the user." });
     return error;
  }
};
