import express from "express";
import upload from "../../middleware/uploadMiddleware.js";
import { uploadImage } from "../../controllers/product/uploadImageController.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import adminMiddleware from "../../middleware/adminMiddleware.js";

const router = express.Router();

// upload.single("image") → this expects form-data with key: image
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  uploadImage
);

export default router;
