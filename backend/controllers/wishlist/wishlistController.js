import Wishlist from "../../models/WishlistModel.js";

/**
 * Add to wishlist
 * POST /api/wishlist/add
 */
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    // avoid duplicates
    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ message: "Product already in wishlist" });
    }

    wishlist.products.push(productId);
    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });
  } catch (error) {
    console.error("Wishlist add error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


/**
 * Remove from wishlist
 * DELETE /api/wishlist/remove/:productId
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    return res.status(200).json({
      success: true,
      message: "Product removed",
      wishlist,
    });
  } catch (error) {
    console.error("Wishlist remove error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


/**
 * Get wishlist items
 * GET /api/wishlist
 */
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId }).populate(
      "products",
      "title price images"
    );

    return res.status(200).json({
      success: true,
      wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
