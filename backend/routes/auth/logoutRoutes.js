import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import logoutController from "../../controllers/auth/logoutController.js";

const router = express.Router();

router.post("/", authMiddleware, logoutController);

export default router;
