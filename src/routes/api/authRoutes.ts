import { Router } from "express";
import { loginUser } from "../../controllers/auth/login";
import { registerUser } from "../../controllers/auth/register";
import { verifyOtp } from "../../controllers/auth/verifyOtp";
const router = Router();



router.post("/login",loginUser)
router.post("/register",registerUser)
router.post("/verify",verifyOtp)











export default router;