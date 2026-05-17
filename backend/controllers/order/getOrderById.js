import Order from "../../models/OrderModel.js";

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("items.product", "title price images")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const isOwner = order.user?._id ? order.user._id.toString() === req.user._id.toString() : order.user.toString() === req.user._id.toString();
    if (req.user.role !== "admin" && !isOwner) {
      return res.status(403).json({ success: false, message: "Not authorized to view this order" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Get order by id error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
