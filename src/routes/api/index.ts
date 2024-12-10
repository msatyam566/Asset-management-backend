import express from 'express';
import authRoutes from "./authRoutes"
import adminRoutes from "./adminRoutes";
import inventoryRoutes from "./inventoryRoutes";
import shopOwnerRoutes from "./staffRoutes"

const router = express.Router();


router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/inventory',inventoryRoutes)
router.use("/shop-owner",shopOwnerRoutes)





export default router;