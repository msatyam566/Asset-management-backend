import { Request, Response } from "express";
import prisma from "../../config/prismaClient";



export const updateUser = async (req: Request, res: Response) => {
    try {
      const { name, email, mobile, role,monthlyTarget } = req.body;
      const userId = req.params.id;
  
      // Validate input
      if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
      }
  
      // Check if the user exists
      const user = await prisma.user.findUnique({
        where: { id: userId ,isDeleted: false},
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      // Update user details
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          name: name || user.name,
          email: email || user.email,
          mobile: mobile || user.mobile,
          monthlyTarget:monthlyTarget || user.monthlyTarget,
          role: role || user.role,
        },
      });
  
      res.status(200).json({
        message: "User updated successfully.",
        user: updatedUser,
      });
    } catch (error:any) {
      console.error("Error during user update:", error);
      res.status(500).json({ message: "An error occurred while updating the user." });
      return error;
    }
  };
  