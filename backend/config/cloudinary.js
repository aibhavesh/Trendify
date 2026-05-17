import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Ensure .env is loaded
dotenv.config();

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

// Debug: Log what we're reading from .env
console.log("📋 Cloudinary Debug:");
console.log("  - CLOUDINARY_CLOUD_NAME:", cloudName ? `✓ (${cloudName})` : "✗ missing");
console.log("  - CLOUDINARY_API_KEY:", apiKey ? `✓ (${apiKey.substring(0, 10)}...)` : "✗ missing");
console.log("  - CLOUDINARY_API_SECRET:", apiSecret ? `✓ (${apiSecret.substring(0, 10)}...)` : "✗ missing");

if (!cloudName || !apiKey || !apiSecret || cloudName === "placeholder") {
  console.warn("⚠️  Cloudinary credentials incomplete. Image upload features will not work.");
} else {
  try {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });
    console.log("✅ Cloudinary configured successfully for cloud:", cloudName);
  } catch (error) {
    console.error("❌ Cloudinary configuration error:", error.message);
  }
}

export default cloudinary;
