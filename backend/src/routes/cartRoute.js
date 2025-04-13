const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");
const userRole = require("../utils/enums/userRole");
// should protect their routes
router.route("/products").get(verifyToken, cartController.getCartProducts);
router.route("/").delete(verifyToken, cartController.removeAllFromCart);
router.route("/product").put(verifyToken, cartController.updateQuantity);
router
  .route("/product")
  .delete(verifyToken, cartController.removeProductFromCart);

router
  .route("/add")
  .post(
    verifyToken,
    checkRole([userRole.CUSTOMER]),
    cartController.addItemToCart
  );
// router.route("/:itemId").delete(cartController.removeItem);

module.exports = router;
