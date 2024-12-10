import { Request, Response } from "express";
import prisma from "../../config/prismaClient"; 



// Delete a user  Delete
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error:any) {
    res.status(500).json({ message: "Error deleting user", error });
    return error;
  }
};