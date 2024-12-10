import { Router } from "express";
import { createCategory, getCategories, getCategoriesByStaff } from "../../controllers/inventory/category/category";
import { createProduct } from "../../controllers/inventory/product/CreateProduct";
import validateAccessToken from "../../middlewares/jwtValidation";
import { getProducts } from "../../controllers/inventory/product/getProduct";
import { deleteProduct } from "../../controllers/inventory/product/deleteProduct";
import upload from "../../config/multerConfig"
import { getProductByStaff } from "../../controllers/inventory/product/getProductByStaff";
const router = Router();




// category routes
router.post('/category',validateAccessToken, createCategory)
router.get('/category',validateAccessToken,getCategories)
router.get('/category/staff',validateAccessToken,getCategoriesByStaff)


// product routes
router.post('/product',validateAccessToken, upload.single("productImages"), createProduct)
router.get('/product',validateAccessToken,getProducts)
router.get('/product/staff',validateAccessToken,getProductByStaff)
router.delete('/product/:id',validateAccessToken,deleteProduct)









export default router;