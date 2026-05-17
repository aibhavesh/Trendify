import express from "express";
import resetPasswordController from "../../controllers/auth/resetPasswordController.js";

const router = express.Router();

// Route: POST /api/auth/reset-password/:token
router.post("/:token", resetPasswordController);

export default router;
