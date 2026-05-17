import getRazorpay from "../../config/razorpay.js";
import Order from "../../models/OrderModel.js";

export const createPaymentOrder = async (req, res) => {
  try {
    const razorpayInstance = getRazorpay();
    if (!razorpayInstance) {
      return res.status(503).json({ message: "Payment service not configured" });
    }

    const { orderId } = req.body; // our internal order
    if (!orderId) {
      return res.status(400).json({ success: false, message: "orderId is required" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (String(order.user) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const options = {
      amount: order.totalAmount * 100, // Razorpay requires in paise
      currency: "INR",
      receipt: `order_rcpt_${order._id}`,
    };

    const paymentOrder = await razorpayInstance.orders.create(options);

    return res.status(200).json({
      success: true,
      paymentOrder,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
