import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import loginRoutes from "./routes/auth/loginRoutes.js";
import registerRoutes from "./routes/auth/registerRoutes.js";
import logoutRoutes from "./routes/auth/logoutRoutes.js";
import forgotPasswordRoutes from "./routes/auth/forgotPasswordRoutes.js";
import resetPasswordRoutes from "./routes/auth/resetPasswordRoutes.js";
import userRoutes from "./routes/user/userRoutes.js";
import productRoutes from "./routes/product/productRoutes.js";
import cartRoutes from "./routes/cart/cartRoutes.js";
import orderRoutes from "./routes/order/orderRoutes.js";
import wishlistRoutes from "./routes/wishlist/wishlistRoutes.js";
import reviewRoutes from "./routes/review/reviewRoutes.js";
import uploadRoutes from "./routes/utils/uploadRoutes.js";
import contactRoutes from "./routes/utils/contactRoutes.js";
import paymentRoutes from "./routes/payment/paymentRoutes.js";
import adminRoutes from "./routes/admin/adminRoutes.js";
import couponRoutes from "./routes/coupon/couponRoutes.js";
import { apiRateLimiter } from "./middleware/rateLimiter.js";

// Load environment variables
dotenv.config();

const app = express();

// --------------------------------------------------
// Basic Security Settings
// --------------------------------------------------
app.disable("x-powered-by");
app.set("trust proxy", 1);

// --------------------------------------------------
// Allowed Origins
// --------------------------------------------------
const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://trendify-bhaveshprajapat9981-4733s-projects.vercel.app",
  "https://trendify-4dv1.onrender.com",
  "https://trendify-fi82.onrender.com",
];

// Optional environment variable:
// CORS_ORIGINS=https://domain1.com,https://domain2.com
const configuredOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins =
  configuredOrigins.length > 0 ? configuredOrigins : defaultOrigins;

// --------------------------------------------------
// Helmet Security Middleware
// --------------------------------------------------
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// --------------------------------------------------
// CORS Configuration
// --------------------------------------------------
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin
      // (Postman, Render health checks, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Allow exact matches
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow all Vercel deployments
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);
      console.log("✅ Allowed Origins:", allowedOrigins);

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
    ],
  })
);

// --------------------------------------------------
// Body Parsers
// --------------------------------------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// --------------------------------------------------
// Rate Limiting
// --------------------------------------------------
app.use("/api", apiRateLimiter);

// --------------------------------------------------
// API Routes
// --------------------------------------------------

// Admin
app.use("/api/admin", adminRoutes);

// Authentication
app.use("/api/auth/login", loginRoutes);
app.use("/api/auth/register", registerRoutes);
app.use("/api/auth/logout", logoutRoutes);
app.use("/api/auth/forgot-password", forgotPasswordRoutes);
app.use("/api/auth/reset-password", resetPasswordRoutes);

// User
app.use("/api/users", userRoutes);

// Products
app.use("/api/products", productRoutes);

// Cart
app.use("/api/cart", cartRoutes);

// Orders
app.use("/api/orders", orderRoutes);

// Wishlist
app.use("/api/wishlist", wishlistRoutes);

// Reviews
app.use("/api/reviews", reviewRoutes);

// Upload
app.use("/api/upload", uploadRoutes);

// Contact
app.use("/api/contact", contactRoutes);

// Payment
app.use("/api/payment", paymentRoutes);

// Coupons
app.use("/api/coupons", couponRoutes);

// --------------------------------------------------
// Root Route
// --------------------------------------------------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Trendify Backend API is running successfully 🚀",
    environment: process.env.NODE_ENV || "development",
  });
});

// --------------------------------------------------
// Health Check Route
// --------------------------------------------------
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// --------------------------------------------------
// 404 Handler
// --------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// --------------------------------------------------
// Global Error Handler
// --------------------------------------------------
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);

  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS policy blocked this request.",
      origin: req.headers.origin || "Unknown",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;