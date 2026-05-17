import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import adminMiddleware from "../../middleware/adminMiddleware.js";
import {
	createContactMessage,
	getAllContactMessages,
} from "../../controllers/utils/contactController.js";

const router = express.Router();

router.post("/", createContactMessage);
router.get("/", authMiddleware, adminMiddleware, getAllContactMessages);

export default router;
