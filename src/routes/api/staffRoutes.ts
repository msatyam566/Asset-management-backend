import { Router } from "express";
import validateAccessToken from "../../middlewares/jwtValidation";
import { roleCheck } from "../../middlewares/roleCheck";
import { addUser } from "../../controllers/shopOwner/addStaff";
import { getAllStaff } from "../../controllers/shopOwner/getAllStaff";
import { deleteUser } from "../../controllers/shopOwner/deleteStaff";
const router = Router();



router.post('/add',validateAccessToken,roleCheck(["SHOPOWNER","ADMIN"]), addUser )
router.get('/staff',validateAccessToken,roleCheck(["SHOPOWNER","ADMIN"]),getAllStaff )
router.delete('/staff',validateAccessToken,roleCheck(["SHOPOWNER","ADMIN"]),deleteUser )











export default router;