const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const productStatus = require("../utils/enums/productStatus");

const getAnalyticsData = async () => {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments({
    status: productStatus.APPROVED,
  });

  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // it groups all documents together,
        totalSales: { $sum: 1 },
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

module.exports = getAnalyticsData;
