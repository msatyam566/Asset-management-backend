import { Request, Response } from "express";
import prisma from "../../config/prismaClient";

// Create a payment
export const createPayment = async (req: Request, res: Response) => {
  try {
    const { paymentMethod, amount } = req.body;

    if(amount.length === 0){
      return res.status(400).send({message:"Amount can not be empty"})
    }
    if(!paymentMethod){
      return res.status(400).send({message:"Payment method can not be empty"})
    }
    
    const payment = await prisma.payment.create({
      data:{
        paymentMethod,
        amount,
        paymentStatus:true,
        paymentDate:new Date(),
      }
    })


    return res
      .status(201)
      .json({ message: "Payment added successfully", data:payment });
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Error creating payment", error:error.message });
    return error;
  }
};


