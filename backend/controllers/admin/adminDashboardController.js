import Order from "../../models/OrderModel.js";
import User from "../../models/UserModel.js";
import Product from "../../models/ProductModel.js";

export const getAdminStats = async (req, res) => {
  try {
    // Parallel queries for better performance
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      revenueAgg,
      latestOrders,
      lowStockProducts
    ] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments({ orderStatus: "processing" }),
      Order.countDocuments({ orderStatus: "shipped" }),
      Order.countDocuments({ orderStatus: "delivered" }),
      Order.countDocuments({ orderStatus: "cancelled" }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } }
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("user", "name email")
        .populate("items.product", "title price images"),
      Product.find({ stock: { $lt: 10 } })
        .sort({ stock: 1 })
        .limit(10)
        .select("title stock price images")
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue,
        pendingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
      },
      latestOrders,
      lowStockProducts,
    });

  } catch (error) {
    console.error("âŒ Admin stats error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch admin statistics"
    });
  }
};
