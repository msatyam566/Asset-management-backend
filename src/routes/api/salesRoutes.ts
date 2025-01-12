import { Router } from "express";
import validateAccessToken from "../../middlewares/jwtValidation";
import { roleCheck } from "../../middlewares/roleCheck";
import { getSales } from "../../controllers/sales/getSales";
import { getAnalyticsStaff } from "../../controllers/sales/getAnalyticsStaff";
import { getAnalyticsShop } from "../../controllers/shopOwner/getAnalyticsShop";
import { getSalesStaff } from "../../controllers/sales/getSalesStaff";

const router = Router();



router.get('/',validateAccessToken,roleCheck(["SHOPOWNER","ADMIN"]),getSales)
router.get('/staff',validateAccessToken,roleCheck(["STAFF"]),getSalesStaff)
router.get('/analytics',validateAccessToken,roleCheck(["STAFF"]),getAnalyticsStaff)
router.get('/shop/analytics',validateAccessToken,roleCheck(["SHOPOWNER"]),getAnalyticsShop)







export default router;