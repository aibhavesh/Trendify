// backend/controllers/product/productController.js
import Product from "../../models/ProductModel.js";

/**
 * Create product (admin)
 * POST /api/products
 */
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      discountPercent,
      category,
      tags,
      images,
      sizes,
      colors,
      stock,
      isTrending,
      isNewArrival,
      isFeatured,
      isBestSeller,
    } = req.body;

    if (!title || !description || price == null) {
      return res.status(400).json({ success: false, message: "title, description and price are required" });
    }

    const normalizedPrice = Number(price);
    const normalizedStock = Number(stock ?? 0);
    const normalizedDiscount = Number(discountPercent ?? 0);

    if (!Number.isFinite(normalizedPrice) || normalizedPrice < 0) {
      return res.status(400).json({ success: false, message: "price must be a positive number" });
    }
    if (!Number.isFinite(normalizedStock) || normalizedStock < 0) {
      return res.status(400).json({ success: false, message: "stock must be a positive number" });
    }
    if (!Number.isFinite(normalizedDiscount) || normalizedDiscount < 0 || normalizedDiscount > 90) {
      return res.status(400).json({ success: false, message: "discountPercent must be between 0 and 90" });
    }

    const toArray = (value) => {
      if (Array.isArray(value)) return value.map((v) => String(v).trim()).filter(Boolean);
      if (typeof value === "string") return value.split(",").map((v) => v.trim()).filter(Boolean);
      return [];
    };

    const product = await Product.create({
      title,
      description,
      price: normalizedPrice,
      discountPercent: normalizedDiscount,
      category,
      tags: toArray(tags),
      images: toArray(images),
      sizes: toArray(sizes),
      colors: toArray(colors),
      stock: normalizedStock,
      isTrending: Boolean(isTrending),
      isNewArrival: Boolean(isNewArrival),
      isFeatured: Boolean(isFeatured),
      isBestSeller: Boolean(isBestSeller),
      createdBy: req.user ? req.user._id : null,
    });

    return res.status(201).json({ success: true, message: "Product created", data: product });
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

/**
 * Get all products (public)
 * GET /api/products
 * supports optional query params (page, category, q, tags)
 */
export const getProducts = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 120);
    const skip = (page - 1) * limit;
    const sort = req.query.sort === "price_asc"
      ? { price: 1 }
      : req.query.sort === "price_desc"
        ? { price: -1 }
        : { createdAt: -1 };

    const products = await Product.find().sort(sort).skip(skip).limit(limit);
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Delete product
 * DELETE /api/products/:id
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log("Delete product error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

/**
 * Get product by id
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("createdBy", "name email role")
      .populate("reviews.user", "name email");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Get product by id error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
