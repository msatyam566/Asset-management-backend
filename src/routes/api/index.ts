import express from 'express';
import authRoutes from "./authRoutes"
import adminRoutes from "./adminRoutes";
import inventoryRoutes from "./inventoryRoutes";
import shopOwnerRoutes from "./staffRoutes";
import invoiceRoutes from "./invoiceRoutes";
import paymentRoutes from "./paymentRoutes";
import salesRoutes from "./salesRoutes"

const router = express.Router();


router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/inventory',inventoryRoutes)
router.use("/shop-owner",shopOwnerRoutes)
router.use("/invoice",invoiceRoutes)
router.use('/payment',paymentRoutes)
router.use('/sales',salesRoutes)






export default router;