const express = require("express");
const { getAnalyticsData } = require("../controllers/analyticsController");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");
const userRole = require("../utils/enums/userRole");

const router = express.Router();

// Protected route to get analytics data
router.get("/dashboard", verifyToken, checkRole([userRole.ADMIN]), async (req, res, next) => {
  try {
    const data = await getAnalyticsData();
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
