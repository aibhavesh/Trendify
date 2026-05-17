import Cart from "../../models/CartModel.js";
import Order from "../../models/OrderModel.js";
import Coupon from "../../models/CouponModel.js";

/**
 * Place a new order (COD or Online)
 * POST /api/orders
 */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const { shippingAddress, paymentMethod, couponCode } = req.body;

    if (!shippingAddress || !shippingAddress.fullName) {
      return res.status(400).json({ message: "Shipping address required" });
    }

    // 1. Fetch user cart
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const subtotal = cart.totalPrice;
    const shipping = subtotal >= 499 ? 0 : 49;
    let discountAmount = 0;
    let normalizedCouponCode = null;

    if (couponCode) {
      const code = String(couponCode).trim().toUpperCase();
      const coupon = await Coupon.findOne({ code, isActive: true });

      if (!coupon) {
        return res.status(400).json({ message: "Invalid coupon code" });
      }
      if (coupon.expiresAt.getTime() < Date.now()) {
        return res.status(400).json({ message: "Coupon has expired" });
      }
      if (subtotal < coupon.minOrderAmount) {
        return res.status(400).json({ message: `Minimum order amount for this coupon is ${coupon.minOrderAmount}` });
      }

      const rawDiscount = (subtotal * coupon.discountPercent) / 100;
      discountAmount = coupon.maxDiscountAmount > 0 ? Math.min(rawDiscount, coupon.maxDiscountAmount) : rawDiscount;
      discountAmount = Number(discountAmount.toFixed(2));
      normalizedCouponCode = coupon.code;
    }

    const finalTotal = Number((subtotal + shipping - discountAmount).toFixed(2));

    // 2. Create order
    const order = await Order.create({
      user: userId,
      items: cart.items,
      shippingAddress,
      paymentMethod: paymentMethod || "COD",
      totalAmount: finalTotal,
      couponCode: normalizedCouponCode,
      discountAmount,
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
