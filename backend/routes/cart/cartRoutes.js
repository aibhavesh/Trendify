import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
} from "../../controllers/cart/cartController.js";

const router = express.Router();

router.post("/add", authMiddleware, addToCart);
router.get("/", authMiddleware, getCart);
router.put("/update", authMiddleware, updateQuantity);
router.delete("/remove/:productId", authMiddleware, removeFromCart);

export default router;
