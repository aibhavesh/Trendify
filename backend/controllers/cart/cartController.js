import Cart from "../../models/CartModel.js";
import Product from "../../models/ProductModel.js";

/**
 * Add item to cart
 * POST /api/cart/add
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // 1. Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Find existing cart
    let cart = await Cart.findOne({ user: userId });

    // 3. If no cart exists → create new one
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
        totalPrice: 0,
      });
    }

    // 4. Check if the product is already in the cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({
        product: product._id,
        quantity: quantity || 1,
        price: product.price,
      });
    }

    // 5. Recalculate total price
    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get current user's cart
 * GET /api/cart
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ user: userId }).populate(
      "items.product",
      "title price images"
    );

    return res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Update quantity of a product in the cart
 * PUT /api/cart/update
 */
export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    item.quantity = quantity;

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Update quantity error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Remove item from cart
 * DELETE /api/cart/remove/:productId
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.totalPrice = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    return res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Remove from cart error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
