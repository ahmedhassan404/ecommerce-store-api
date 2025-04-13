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

module.exports = {
  createCategory,
};
