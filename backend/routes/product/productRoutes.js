import express from 'express';
import { createProduct, getProducts,getProductById } from '../../controllers/product/productController.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import adminMiddleware from '../../middleware/adminMiddleware.js';
import { get } from 'mongoose';

const router = express.Router();

router.get('/',getProducts);
router.get('/:id',getProductById);

router.post('/',authMiddleware,adminMiddleware,createProduct);

export default router;