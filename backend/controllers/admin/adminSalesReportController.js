import Order from "../../models/OrderModel.js";

export const getSalesReport = async (req, res) => {
  try {
    const from = req.query.from ? new Date(req.query.from) : new Date(Date.now() - 29 * 24 * 60 * 60 * 1000);
    const to = req.query.to ? new Date(req.query.to) : new Date();

    const match = {
      createdAt: { $gte: from, $lte: to },
    };

    const [dailySales, summary] = await Promise.all([
      Order.aggregate([
        { $match: match },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            totalSales: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ]),
      Order.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            grossSales: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 },
            paidOrders: {
              $sum: {
                $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0],
              },
            },
            cancelledOrders: {
              $sum: {
                $cond: [{ $eq: ["$orderStatus", "cancelled"] }, 1, 0],
              },
            },
          },
        },
      ]),
    ]);

    return res.status(200).json({
      success: true,
      range: { from, to },
      summary: summary[0] || {
        grossSales: 0,
        totalOrders: 0,
        paidOrders: 0,
        cancelledOrders: 0,
      },
      dailySales,
    });
  } catch (error) {
    console.error("Sales report error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
