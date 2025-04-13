const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const couponController = require("../controllers/couponController");
const router = express.Router();

router.route("/").get(verifyToken, couponController.getCoupon);
router.route("/validate").get(verifyToken, couponController.validateCoupon);
module.exports = router;
