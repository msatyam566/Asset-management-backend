import { Router } from "express";
import validateAccessToken from "../../middlewares/jwtValidation";
import { roleCheck } from "../../middlewares/roleCheck";
import { addUser,getAllStaff,deleteUser } from "../../controllers/shopOwner/staff";

const router = Router();



router.post('/add',validateAccessToken,roleCheck(["SHOPOWNER","ADMIN"]), addUser )
router.get('/staff',validateAccessToken,roleCheck(["SHOPOWNER","ADMIN"]),getAllStaff )
router.delete('/staff',validateAccessToken,roleCheck(["SHOPOWNER","ADMIN"]),deleteUser )











export default router;