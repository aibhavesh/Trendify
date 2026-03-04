import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { createPaymentOrder } from "../../controllers/payment/createPaymentOrder.js";
import { verifyPayment } from "../../controllers/payment/verifyPayment.js";

const router = express.Router();

router.post("/create-order", authMiddleware, createPaymentOrder);
router.post("/verify", authMiddleware, verifyPayment);

export default router;
