import express from "express";
import loginController from "../../controllers/auth/loginController.js";
import { loginRateLimiter } from "../../middleware/rateLimiter.js";

const router = express.Router();

// Route: POST /api/auth/login
router.post("/", loginRateLimiter, loginController);

export default router;
