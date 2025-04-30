const Product = require("../models/product");
const productStatus = require("../utils/enums/productStatus");
const Category = require("../models/category");
// @desc    Get list of approved products
// @route   GET /api/products
// @access  Customer
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      status: productStatus.APPROVED,
      stock: { $gt: 0 },
    });
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No approved products found",
        data: [],
      });
    }

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of approved products associated with seller
// @route   GET /api/seller/products
// @access  Seller
const getProductsForSeller = async (req, res, next) => {
  try {
    const products = await Product.find({
      status: productStatus.APPROVED,
      sellerId: req.userId,
    });
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No approved products found",
        data: [],
      });
    }

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of pending products to approve
// @route   GET /api/admin/products
// @access  admin
const getProductsForAdminToApprove = async (req, res, next) => {
  try {
    const products = await Product.find({
      status: productStatus.PENDING,
    });
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No pending products found",
        data: [],
      });
    }

    res
      .status(200)
      .json({ success: true, totalCount: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product by seller
// @route   POST /api/products
// @access  seller
const addProduct = async (req, res, next) => {
  try {
    // category
    const { name, description, price, images, stock, category } = req.body;

    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide name, description, price, at least one image, and category",
      });
    }
    const existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Invalid category - Category does not exist",
      });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      images,
      sellerId: req.userId, // Associate product with the authenticated seller
      stock,
      category: existingCategory._id,
    });

    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    next(error);
  }
};

const getProductsByCategory = async (req, res, next) => {
  const { category } = req.params;
  try {
    const products = await Product.find({ category });
    res.json({ products });
  } catch (error) {
    next(error);
  }
};

// @desc    delete product
// @route   DELETE /api/products/:productId
// @access  seller add this product or admin
const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const userId = req.userId;
    const userRole = req.userRole;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.sellerId.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden - you do not have permission to delete this product",
      });
    }

    await Product.findByIdAndDelete(productId);
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product by seller
// @route   PATCH /api/products/:productId
// @access  seller
const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const userId = req.userId; // Access userId from req.user
    const { name, description, price, images } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.sellerId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden - you do not have permission to update this product",
      });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (images) product.images = images;

    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve product by admin
// @route   GET /api/admin/products/:productId/approve
// @access  admin
const updateProductStatusToApproved = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.status = productStatus.APPROVED;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product status updated to APPROVED",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject product by admin
// @route   GET /api/admin/products/:productId/reject
// @access  admin
const updateProductStatusToRejected = async (req, res, next) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    product.status = productStatus.REJECTED;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product status updated to REJECTED",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  getProductsForSeller,
  getProductsForAdminToApprove,
  updateProductStatusToApproved,
  updateProductStatusToRejected,
  getProductsByCategory,
};
