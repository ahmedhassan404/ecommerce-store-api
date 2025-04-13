const Coupon = require("../models/coupon");

const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.find({ userId: res.userId, isActive: true });
    res.json(coupon || null);
  } catch (error) {
    console.log("Error in getCoupon controller", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.find({
      code,
      userId: req.userId,
      isActive: true,
    });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    if (coupon.expirationDate < new Date()) {
      (coupon.isActive = false), await coupon.save();
      return res.status(404).json({ message: "Coupon expired" });
    }
    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.log("Error in validateCoupon controller", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getCoupon, validateCoupon };
