import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import adminMiddleware from "../../middleware/adminMiddleware.js";
import { getAdminStats } from "../../controllers/admin/adminDashboardController.js";
import { adminLogin } from "../../controllers/admin/adminAuthController.js";

const router = express.Router();

// Admin Login Route (Public)
router.post("/login", adminLogin);

// Admin Dashboard Route (Protected)
router.get("/dashboard", authMiddleware, adminMiddleware, getAdminStats);

export default router;
