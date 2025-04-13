const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");
const userRole = require("../utils/enums/userRole");
const { getAnalyticsData } = require("../controllers/analyticsController");
router
  .route("/")
  .get(verifyToken, checkRole([userRole.ADMIN]), async (req, res) => {
    try {
      const analyticsData = await getAnalyticsData();
      res.json({
        analyticsData,
      });
    } catch (error) {
      console.log("Error in analytics route", error.message);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

module.exports = router;
