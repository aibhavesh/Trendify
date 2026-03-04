import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import loginRoutes from "./routes/auth/loginRoutes.js";
import registerRoutes from "./routes/auth/registerRoutes.js";
import logoutRoutes from "./routes/auth/logoutRoutes.js";
import userRoutes from "./routes/user/userRoutes.js";
import productRoutes from "./routes/product/productRoutes.js";
import cartRoutes from "./routes/cart/cartRoutes.js";
import orderRoutes from "./routes/order/orderRoutes.js";
import wishlistRoutes from "./routes/wishlist/wishlistRoutes.js";
import reviewRoutes from "./routes/review/reviewRoutes.js";
import uploadRoutes from "./routes/utils/uploadRoutes.js";
import paymentRoutes from "./routes/payment/paymentRoutes.js";
import adminRoutes from "./routes/admin/adminRoutes.js";

// Load environment variables FIRST
dotenv.config();

const app = express();

// CORS configuration - MUST BE BEFORE ROUTES
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/admin", adminRoutes);

app.use("/api/auth/login", loginRoutes);
app.use("/api/auth/register", registerRoutes);
app.use("/api/auth/logout", logoutRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payment", paymentRoutes);

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
