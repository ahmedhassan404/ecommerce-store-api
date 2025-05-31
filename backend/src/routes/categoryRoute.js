const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");
const userRole = require("../utils/enums/userRole");
const categoryController = require("../controllers/categoryController");
const productController = require("../controllers/productController");

router
    .route("/")
    .post(
        verifyToken,
        checkRole([userRole.ADMIN]),
        categoryController.getCategories
    )
    .get(categoryController.getCategories);

router
    .route("/:categoryId")
    .delete(
        verifyToken,
        checkRole([userRole.ADMIN]),
        categoryController.deleteCategory
    );

router
    .route("/add")
    .post(
        verifyToken,
        checkRole([userRole.ADMIN]),
        categoryController.createCategory
    );

module.exports = router;