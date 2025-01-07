import { Router } from "express";
import validateAccessToken from "../../middlewares/jwtValidation";
import { roleCheck } from "../../middlewares/roleCheck";
import { getSales } from "../../controllers/sales/getSales";
import { getSalesAnalytics } from "../../controllers/sales/getSalesDetails";
import { getShopOwnerAnalytics } from "../../controllers/sales/getSalesDetailsShop";

const router = Router();



router.get('/',validateAccessToken,roleCheck(["SHOPOWNER","ADMIN"]),getSales)
router.get('/analytics',validateAccessToken,roleCheck(["STAFF"]),getSalesAnalytics)
router.get('/shop/analytics/',validateAccessToken,roleCheck(["SHOPOWNER"]),getShopOwnerAnalytics)







export default router;