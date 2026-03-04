// controllers/product/searchProductController.js

import Product from "../../models/ProductModel.js";

/**
 * Search products
 * GET /api/products/search?q=term
 */
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    // 1. If no search term provided
    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query (q) is required",
      });
    }

    // 2. Regex pattern (case insensitive)
    const regex = new RegExp(q, "i");

    // 3. Search by title, description, or tags
    const products = await Product.find({
      $or: [
        { title: regex },
        { description: regex },
        { tags: regex },
      ],
    });

    return res.status(200).json({
      success: true,
      query: q,
      results: products.length,
      data: products,
    });

  } catch (error) {
    console.error("Search products error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
