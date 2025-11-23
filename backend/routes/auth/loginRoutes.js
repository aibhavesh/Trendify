import express from "express";
import loginController from "../../controllers/auth/loginController.js";

const router = express.Router();

// Route: POST /api/auth/login
router.post("/", loginController);

export default router;
