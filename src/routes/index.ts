import { Router, Request, Response, NextFunction } from "express";
import createError from "http-errors";
import apiRoutes from "./api";

const router = Router();

router.use("/api", apiRoutes);

router.use("/api", (req: Request, res: Response, next: NextFunction) => {
  next(createError.NotFound("The route you are trying to access does not exist."));
});


export default router;
