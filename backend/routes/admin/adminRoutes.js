import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import adminMiddleware from "../../middleware/adminMiddleware.js";
import { getAdminStats } from "../../controllers/admin/adminDashboardController.js";
import { adminLogin } from "../../controllers/admin/adminAuthController.js";
import { getAdminUsers } from "../../controllers/admin/adminUsersController.js";
import { getSalesReport } from "../../controllers/admin/adminSalesReportController.js";
import { loginRateLimiter } from "../../middleware/rateLimiter.js";

const router = express.Router();

// Admin Login Route (Public)
router.post("/login", loginRateLimiter, adminLogin);

// Admin Dashboard Route (Protected)
router.get("/dashboard", authMiddleware, adminMiddleware, getAdminStats);
router.get("/users", authMiddleware, adminMiddleware, getAdminUsers);
router.get("/sales-report", authMiddleware, adminMiddleware, getSalesReport);

export default router;
