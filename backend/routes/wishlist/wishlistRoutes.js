import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} from "../../controllers/wishlist/wishlistController.js";

const router = express.Router();

router.post("/add", authMiddleware, addToWishlist);
router.delete("/remove/:productId", authMiddleware, removeFromWishlist);
router.get("/", authMiddleware, getWishlist);

export default router;
