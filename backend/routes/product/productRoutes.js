import express from 'express';
import { createProduct, getProducts,getProductById } from '../../controllers/product/productController.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import adminMiddleware from '../../middleware/adminMiddleware.js';
import { get } from 'mongoose';
import {updateProductController } from "../../controllers/product/updateProductController.js";
import {deleteProductController} from "../../controllers/product/deleteProductController.js";

const router = express.Router();
router.delete("/:id", authMiddleware, adminMiddleware, deleteProductController);
import { searchProducts } from "../../controllers/product/searchProductController.js";
import { filterProducts } from "../../controllers/product/filterProductController.js";
import { getTrendingProducts } from "../../controllers/product/trendingProductController.js";

router.get("/trending", getTrendingProducts);

router.get("/filter", filterProducts);

router.get("/search", searchProducts);

router.put("/:id", authMiddleware, adminMiddleware, updateProductController);

router.get('/',getProducts);
router.get('/:id',getProductById);

router.post('/',authMiddleware,adminMiddleware,createProduct);

export default router;