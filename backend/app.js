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

// Load environment variables FIRST
dotenv.config();

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

const defaultOrigins = ["http://localhost:5173", "https://trendify-4dv1.onrender.com/api","https://trendify-4dv1.onrender.com"];
const configuredOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = configuredOrigins.length > 0 ? configuredOrigins : defaultOrigins;

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration - MUST BE BEFORE ROUTES
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use("/api", apiRateLimiter);

// Routes
app.use("/api/admin", adminRoutes);

app.use("/api/auth/login", loginRoutes);
app.use("/api/auth/register", registerRoutes);
app.use("/api/auth/logout", logoutRoutes);
app.use("/api/auth/forgot-password", forgotPasswordRoutes);
app.use("/api/auth/reset-password", resetPasswordRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/coupons", couponRoutes);

// Test endpoint
app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

export default app;
