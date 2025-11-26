import express from "express";
import authMiddleware from "../../middleware/authMiddleware.js";
import { addReview } from "../../controllers/review/addReview.js";

const router = express.Router();

// add or update review
router.post("/:productId", authMiddleware, addReview);

export default router;
