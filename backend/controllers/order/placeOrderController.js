import Cart from "../../models/CartModel.js";
import Order from "../../models/OrderModel.js";

/**
 * Place a new order (COD or Online)
 * POST /api/orders
 */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !shippingAddress.fullName) {
      return res.status(400).json({ message: "Shipping address required" });
    }

    // 1. Fetch user cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2. Create order
    const order = await Order.create({
      user: userId,
      items: cart.items,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      totalAmount: cart.totalPrice,
      paymentStatus: paymentMethod === "COD" ? "pending" : "pending",
      orderStatus: "processing",
    });

    // 3. Clear user cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.log("Place order error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
