import crypto from "crypto";
import Order from "../../models/OrderModel.js";

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Update order as paid
    const order = await Order.findById(orderId);
    order.paymentStatus = "paid";
    await order.save();

    return res.status(200).json({ success: true, message: "Payment Verified", order });
  } catch (error) {
    console.error("Payment verify error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
