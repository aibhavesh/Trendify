// backend/controllers/product/productController.js
import Product from "../../models/ProductModel.js";

/**
 * Create product (admin)
 * POST /api/products
 */
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, category, tags, images, stock } = req.body;

    if (!title || !description || price == null) {
      return res.status(400).json({ success: false, message: "title, description and price are required" });
    }

    const product = await Product.create({
      title,
      description,
      price,
      category,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(",").map(t => t.trim()) : []),
      images: Array.isArray(images) ? images : (images ? images.split(",").map(u => u.trim()) : []),
      stock: stock ?? 0,
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
 * supports optional query params later (page, category, q, tags)
 */
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(100); // simple for now
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * Get product by id
 * GET /api/products/:id
 */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("createdBy", "name email role");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Get product by id error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
