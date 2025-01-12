import { Router } from "express";
import { loginUser } from "../../controllers/auth/login";
import { registerUser } from "../../controllers/auth/register";
import { verifyOtp } from "../../controllers/auth/verifyOtp";
import { resendOtp } from "../../controllers/auth/resendOtp";
import validateAccessToken from "../../middlewares/jwtValidation";
import { getUserById } from "../../controllers/admin/getUserById";
import { forgotPassword } from "../../controllers/auth/forgotPassword";
import { resetPassword } from "../../controllers/auth/resetPassoword";
const router = Router();



router.post("/login",loginUser)
router.post("/register",registerUser)
router.post("/otp",resendOtp)
router.post("/verify",verifyOtp)
router.get("/user", validateAccessToken,  getUserById);
router.post("/forgot-password",forgotPassword)
router.post("/reset-password",resetPassword)











export default router;