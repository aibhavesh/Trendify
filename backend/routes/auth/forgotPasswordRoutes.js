import express from "express";
import forgotPasswordController from "../../controllers/auth/forgotPasswordController.js";

const router = express.Router();

// Route: POST /api/auth/forgot-password
router.post("/", forgotPasswordController);

export default router;
