import razorpayInstance from "../../config/razorpay.js";
import Order from "../../models/OrderModel.js";

export const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body; // our internal order

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
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
    res.status(500).json({ message: "Server error" });
  }
};
