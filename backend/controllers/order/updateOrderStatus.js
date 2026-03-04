import Order from "../../models/OrderModel.js";

export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const status = req.body.status || req.body.orderStatus;

    const validStatuses = ["processing", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.orderStatus = status;

    // if delivered → paymentStatus should be paid (for COD)
    if (status === "delivered") {
      order.paymentStatus = "paid";
    }

    if (status === "cancelled") {
      order.paymentStatus = order.paymentStatus === "paid" ? "paid" : "pending";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
