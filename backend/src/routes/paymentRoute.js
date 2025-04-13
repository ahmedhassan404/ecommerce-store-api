const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const paymentController = require("../controllers/paymentController");
const router = express.Router();

router
  .route("/create-checkout-session")
  .post(verifyToken, paymentController.createCheckoutSession);

router
  .route("/checkout-success")
  .post(verifyToken, paymentController.checkoutSuccess);

module.exports = router;
