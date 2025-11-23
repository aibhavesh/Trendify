import express from "express";
import registerController from "../../controllers/auth/registerController.js";

const router = express.Router();

// Route: POST /api/auth/register
router.post("/", registerController);

export default router;
