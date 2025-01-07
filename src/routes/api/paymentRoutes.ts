import { Router } from "express";
import validateAccessToken from "../../middlewares/jwtValidation";
import { roleCheck } from "../../middlewares/roleCheck";
import { createPayment } from "../../controllers/checkout/payment";

const router = Router();



router.post('/',validateAccessToken, createPayment )











export default router;