import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import { throwError } from "../utils/errorHandler.js";

export const adminDashboard = async (req, res, next) => {
  try {
    // 1. SIMPLE COUNTS (optimized - no full data fetching)
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();

    // 2. REVENUE CALCULATION (aggregation)
    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: "delivered", // important: only completed orders
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" }, // adjust field name if different
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // 3. RESPONSE
    res.status(200).json({
      success: true,
      totalUsers,
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    next(error);
  }
};
