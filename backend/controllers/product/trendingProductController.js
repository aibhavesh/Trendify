// controllers/product/trendingProductController.js

import Product from "../../models/ProductModel.js";

/**
 * Trending products (public)
 * GET /api/products/trending
 */
export const getTrendingProducts = async (req, res) => {
  try {
    // Fetch latest 10 products sorted by createdAt
    const products = await Product.find()
      .sort({ createdAt: -1 }) // newest first
      .limit(10);

    return res.status(200).json({
      success: true,
      results: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Trending products error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
