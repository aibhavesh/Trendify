import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import adminMiddleware from "../../middleware/adminMiddleware.js";
import {
  applyCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../../controllers/coupon/couponController.js";

const router = express.Router();

router.post("/apply", authMiddleware, applyCoupon);
router.get("/", authMiddleware, adminMiddleware, getCoupons);
router.post("/", authMiddleware, adminMiddleware, createCoupon);
router.put("/:id", authMiddleware, adminMiddleware, updateCoupon);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCoupon);

export default router;
