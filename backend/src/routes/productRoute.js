const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");
const productController = require("../controllers/productController");
const checkRole = require("../middlewares/checkRole");
const userRole = require("../utils/enums/userRole");
const upload = require("../middlewares/upload");

router
  .route("/products")
  .get(
    verifyToken,
    checkRole([userRole.CUSTOMER]),
    productController.getProducts
  )
  .post(
    verifyToken,
    checkRole([userRole.ADMIN, userRole.SELLER]),
    upload.array("images", 5),
    productController.addProduct
  );

router
  .route("/seller/products")
  .get(
    verifyToken,
    checkRole([userRole.SELLER]),
    productController.getProductsForSeller
  );

router
  .route("/admin/products")
  .get(
    verifyToken,
    checkRole([userRole.ADMIN]),
    productController.getProductsForAdminToApprove
  );

router
  .route("/products/:productId")
  .get(
    verifyToken,
    checkRole([userRole.CUSTOMER, userRole.SELLER]),
    productController.getProductById
  )
  .delete(
    verifyToken,
    checkRole([userRole.ADMIN, userRole.SELLER]),
    productController.deleteProduct
  )
  .patch(
    verifyToken,
    checkRole([userRole.SELLER]),
    upload.array("images", 5),
    productController.updateProduct
  );

router
  .route("/admin/products/:productId/approve")
  .patch(
    verifyToken,
    checkRole([userRole.ADMIN]),
    productController.updateProductStatusToApproved
  );

router
  .route("/admin/products/:productId/reject")
  .patch(
    verifyToken,
    checkRole([userRole.ADMIN]),
    productController.updateProductStatusToRejected
  );

router
  .route("/category/:category")
  .get(
    verifyToken,
    checkRole([userRole.CUSTOMER]),
    productController.getProductsByCategory
  );

module.exports = router;