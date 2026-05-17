import app from "./app.js";
import connectDB from "./config/db.js";
import { ensureDefaultAdmin } from "./utils/ensureDefaultAdmin.js";
import { initializeRazorpay } from "./config/razorpay.js";

// ===== Initialize Core Services =====
console.log("\n🚀 Initializing Trendify Backend Services...\n");

// Connect to MongoDB
connectDB();

// Initialize Razorpay
initializeRazorpay();

// Cloudinary is auto-initialized in app.js

if (process.env.SEED_DEFAULT_ADMIN !== "false") {
  ensureDefaultAdmin({
    forcePasswordReset: process.env.RESET_DEFAULT_ADMIN_PASSWORD === "true",
    verbose: true,
  }).catch((error) => {
    console.error("Default admin seed failed:", error.message);
  });
}

const PORT = process.env.PORT || 5000;

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("âŒ Server Error:", err.stack);
  const isDevelopment = process.env.NODE_ENV === "development";
  const statusCode = Number(err.status) || 500;
  const safeMessage = statusCode >= 500 && !isDevelopment
    ? "Internal Server Error"
    : err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: safeMessage,
    ...(isDevelopment && { stack: err.stack })
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n✅ Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("\n🎉 Trendify Backend is ready!\n");
});
