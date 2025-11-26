import Cart from "../../models/CartModel.js";
import Order from "../../models/OrderModel.js";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    // 1. Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName) {
      return res.status(400).json({ message: "Shipping address required" });
    }

    // 2. Get user cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 3. Create new order
    const order = await Order.create({
      user: userId,
      items: cart.items,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: "pending",
      orderStatus: "processing",
      totalAmount: cart.totalPrice,
    });

    // 4. Clear user cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    // 5. Send response
    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Place order error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
