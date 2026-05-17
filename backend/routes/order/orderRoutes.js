import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import adminMiddleware from "../../middleware/adminMiddleware.js";
import { placeOrder } from "../../controllers/order/placeOrderController.js";
import { getMyOrders } from "../../controllers/order/getOrdersController.js";
import { getAllOrders } from "../../controllers/order/adminGetOrders.js";
import { updateOrderStatus } from "../../controllers/order/updateOrderStatus.js";
import { getOrderById } from "../../controllers/order/getOrderById.js";

const router = express.Router();

// Update order status (admin only)
router.put(
  "/update-status/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

// Place order (customer)
router.post("/", authMiddleware, placeOrder);

// Get customer's orders
router.get("/", authMiddleware, getMyOrders);

// Admin: Get all orders
router.get("/all", authMiddleware, adminMiddleware, getAllOrders);

// Get single order by ID
router.get("/:id", authMiddleware, getOrderById);

export default router;
