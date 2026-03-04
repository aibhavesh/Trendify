import Order from "../../models/OrderModel.js";

export const getMyOrders = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const query = isAdmin ? {} : { user: req.user.id };

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .populate("items.product", "title price images")
      .populate("user", "name email");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
