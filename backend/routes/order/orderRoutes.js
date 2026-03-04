import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import adminMiddleware from "../../middleware/adminMiddleware.js";
import { placeOrder } from "../../controllers/order/placeOrderController.js";
import { getMyOrders } from "../../controllers/order/getOrdersController.js";
import { getAllOrders } from "../../controllers/order/adminGetOrders.js";
import { updateOrderStatus } from "../../controllers/order/updateOrderStatus.js";
import { getOrderById } from "../../controllers/order/getOrderById.js";

const router = express.Router();

router.put(
  "/update-status/:id",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

router.post("/", authMiddleware, placeOrder);
router.get("/", authMiddleware, getMyOrders);
router.post("/create", authMiddleware, placeOrder);
// admin
router.get("/all", authMiddleware, adminMiddleware, getAllOrders);
router.get("/:id", authMiddleware, getOrderById);

export default router;
