import { Router } from "express";
import { getAllUsers } from "../../controllers/admin/getAllUsers";
import { createShopOwner } from "../../controllers/admin/createShopOwner";
import { deleteUser } from "../../controllers/admin/deleteUser";
import { updateUser } from "../../controllers/admin/updateUser";
import validateAccessToken from "../../middlewares/jwtValidation";
import { roleCheck } from "../../middlewares/roleCheck";
import { getAllshops } from "../../controllers/admin/getAllshops";
import { getAnalyticsAdmin } from "../../controllers/admin/getAnalyticsAdmin";

const router = Router();

router.get("/", validateAccessToken,  roleCheck(["ADMIN"]),  getAllUsers);
router.get("/", validateAccessToken,  roleCheck(["ADMIN"]), getAllshops );
router.get("/analytics",validateAccessToken,roleCheck(["ADMIN"]),getAnalyticsAdmin);
router.post("/shop", validateAccessToken,roleCheck(["ADMIN"]),  createShopOwner);
router.put("/:id", validateAccessToken, updateUser);
router.delete("/:id", validateAccessToken,roleCheck(["ADMIN"]),  deleteUser);

export default router;
