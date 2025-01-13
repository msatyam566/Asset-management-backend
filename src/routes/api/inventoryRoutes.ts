import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../../controllers/inventory/category/category";
import { createProduct } from "../../controllers/inventory/product/CreateProduct";
import validateAccessToken from "../../middlewares/jwtValidation";
import { getProducts } from "../../controllers/inventory/product/getProduct";
import { deleteProduct } from "../../controllers/inventory/product/deleteProduct";
import upload from "../../config/multerConfig"
import { getProductById } from "../../controllers/inventory/product/getProductById";
import { updateProduct } from "../../controllers/inventory/product/updateProduct";
import { addStockQuantity } from "../../controllers/inventory/product/addStockQuantity";
const router = Router();




// category routes
router.post('/category',validateAccessToken, createCategory)
router.get('/category',validateAccessToken,getCategories)
router.put('/category/:id', validateAccessToken,updateCategory)
router.delete('/category/:id',validateAccessToken,deleteCategory)



// product routes
router.post('/product',validateAccessToken, upload.single("productImage"), createProduct)
router.post("/product/stock/:id",validateAccessToken,addStockQuantity )
router.put('/product/:id',validateAccessToken, upload.single("productImage"), updateProduct)
router.get('/product/:id',validateAccessToken, getProductById)
router.get('/product',validateAccessToken,getProducts)
router.delete('/product/:id',validateAccessToken,deleteProduct)









export default router;