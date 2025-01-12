import { Router } from "express";
import validateAccessToken from "../../middlewares/jwtValidation";
import { roleCheck } from "../../middlewares/roleCheck";
import { handleCheckout } from "../../controllers/checkout/checkout";
import { getInvoice } from "../../controllers/invoice/getInvoice";
import { getInvoicePdf } from "../../controllers/invoice/getInvoicePdf";

const router = Router();



router.post('/',validateAccessToken,roleCheck(["STAFF"]), handleCheckout )
router.get('/',validateAccessToken,roleCheck(["ADMIN","SHOPOWNER"]),getInvoice)
router.get('/pdf/:id',validateAccessToken,getInvoicePdf)








export default router;