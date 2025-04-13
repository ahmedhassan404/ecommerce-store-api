const { check } = require("express-validator");
const validator = require("../middlewares/validator");
const User = require("../models/user");
const Category = require("../models/category");
const createProductValidator = [
  check("name")
    .notEmpty()
    .withMessage("Product name must be required")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars")
    .isLength({ max: 32 })
    .withMessage("Must be at most 32 chars"),
  check("description")
    .notEmpty()
    .withMessage("Product description must be required")
    .isLength({ min: 3 })
    .withMessage("Must be at least 3 chars"),
  check("price")
    .notEmpty()
    .withMessage("Product price must be required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("status").optional(),
  check("stock")
    .notEmpty()
    .withMessage("Must be insert stock of product")
    .isNumeric(),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .custom(async (categoryName, { req }) => {
      const category = await Category.findOne({ name: categoryName }); // البحث بالاسم
      if (!category) {
        throw new Error(`Category with name '${categoryName}' does not exist`);
      }
      req.body.category = category._id;
    }),
  validator,
];

module.exports = {
  createProductValidator,
};
