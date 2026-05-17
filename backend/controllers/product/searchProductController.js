// controllers/product/searchProductController.js

import Product from "../../models/ProductModel.js";

/**
 * Search products
 * GET /api/products/search?q=term
 */
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const limit = Math.min(Math.max(Number(req.query.limit) || 60, 1), 120);

    // 1. If no search term provided
    if (!q || q.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query (q) is required",
      });
    }

    const textResults = await Product.find(
      { $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(limit);

    const products = textResults.length > 0
      ? textResults
      : await Product.find({
          $or: [
            { title: new RegExp(q, "i") },
            { description: new RegExp(q, "i") },
            { tags: new RegExp(q, "i") },
          ],
        }).limit(limit);

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
