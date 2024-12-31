import { Router } from "express";
import { getAllUsers } from "../../controllers/admin/getAllUsers";
import { createShopOwner } from "../../controllers/admin/createShopOwner";
import { getUserById } from "../../controllers/admin/getUserById";
import { deleteUser } from "../../controllers/admin/deleteUser";
import { updateUser } from "../../controllers/admin/updateUser";
import validateAccessToken from "../../middlewares/jwtValidation";
import { roleCheck } from "../../middlewares/roleCheck";
import { getProducts } from "../../controllers/admin/getAllProducts";

const router = Router();

router.get("/", validateAccessToken,  roleCheck(["ADMIN"]),  getAllUsers);
router.get("/products",validateAccessToken,roleCheck(["ADMIN"]),getProducts);
router.post("/shop", validateAccessToken,roleCheck(["ADMIN"]),  createShopOwner);
router.get("/:id", validateAccessToken, roleCheck(["ADMIN"]),  getUserById);
router.put("/:id", validateAccessToken, updateUser);
router.delete("/:id", validateAccessToken,roleCheck(["ADMIN"]),  deleteUser);

export default router;
