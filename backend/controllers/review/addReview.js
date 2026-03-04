import Product from "../../models/ProductModel.js";

/**
 * Add or update review
 * POST /api/reviews/:productId
 */
export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rating, comment } = req.body;
    const { productId } = req.params;

    if (!rating) {
      return res.status(400).json({ message: "Rating is required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // check if user already reviewed
    const existingReview = product.reviews.find(
      (r) => r.user.toString() === userId
    );

    if (existingReview) {
      // update review
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      // add new review
      product.reviews.push({
        user: userId,
        rating,
        comment,
      });
    }

    // recalculate average rating
    product.averageRating =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) /
      product.reviews.length;

    await product.save();

    return res.status(200).json({
      success: true,
      message: "Review saved successfully",
      reviews: product.reviews,
      averageRating: product.averageRating,
    });
  } catch (error) {
    console.error("Add review error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
