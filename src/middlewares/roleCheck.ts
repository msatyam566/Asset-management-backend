import { Request, Response, NextFunction } from "express";

export const roleCheck = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role; 
      if (!userRole) {
        return res.status(403).json({ message: "Access denied. No role assigned." });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }

      next();
    } catch (error:any) {
       res.status(500).json({ message: "Error verifying role", error });
       return error;
    }
  };
};
