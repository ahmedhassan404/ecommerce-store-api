const express = require("express");
const verifyToken = require("../middlewares/verifyToken");
const { createOrder } = require("../controllers/paymentController");

const router = express.Router();

router.post("/create", verifyToken, createOrder);

module.exports = router;