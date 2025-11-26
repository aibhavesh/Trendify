// controllers/product/filterProductController.js

import Product from "../../models/ProductModel.js";

/**
 * Filter products (public)
 * GET /api/products/filter
 */
export const filterProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, tags, sort } = req.query;

    // 1. Build filter object step-by-step
    let filter = {};

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Tags filter (comma separated)
    if (tags) {
      const tagsArray = tags.split(",").map(t => t.trim());
      filter.tags = { $in: tagsArray };
    }

    // 2. Sorting logic
    let sortOption = {};
    if (sort === "price_asc") sortOption.price = 1;
    if (sort === "price_desc") sortOption.price = -1;
    if (sort === "latest") sortOption.createdAt = -1;

    // 3. Run query
    const products = await Product.find(filter).sort(sortOption);

    return res.status(200).json({
      success: true,
      results: products.length,
      data: products,
    });
  } catch (error) {
    console.error("Filter products error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
