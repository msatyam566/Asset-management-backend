import { Router } from "express";
import { loginUser } from "../../controllers/auth/login";
import { registerUser } from "../../controllers/auth/register";
import { verifyOtp } from "../../controllers/auth/verifyOtp";
import { generateOtp } from "../../controllers/auth/resendOtp";
const router = Router();



router.post("/login",loginUser)
router.post("/register",registerUser)
router.post("/otp",generateOtp)
router.post("/verify",verifyOtp)











export default router;