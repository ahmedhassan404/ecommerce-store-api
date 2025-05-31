const Category = require("../models/category");

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const category = await Category.create({
      name,
      description,
    });
    res.status(201).json({ message: "Category added successfully", category });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryId;
    const userRole = req.userRole;
    const category = Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (userRole !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden - you do not have permission to delete this product",
      });
    }
    await Category.findByIdAndDelete(categoryId);
    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    if (!categories || categories.length === 0) {
      return res.status(404).json({
        success: true,
        message: "No approved products found",
        data: [],
      });
    }
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  deleteCategory,
  getCategories,
};
