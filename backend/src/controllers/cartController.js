const Cart = require("../models/cart");
const Product = require("../models/product");

const addItemToCart = async (req, res, next) => {
  try {
    // 1. Validate product exists and is in stock
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product || product.stock < 1) {
      return res.status(400).json({ success: false, message: "Out of stock" });
    }

    // 2. Add/update item in the cart
    let cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      cart = new cart({ userId: req.userId });
    }
    const existingItem = cart.items.find(
      (item) => item.productId === productId
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId, quantity: 1, price: product.price });
    }

    // 3. Recalculate total
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const removeAllFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }
    cart.items = [];
    cart.total = 0;
    await cart.save();
    res.json({ success: true, message: "All items from cart", cart });
  } catch (error) {
    console.error("Error removing items from cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateQuantity = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.userId;
    if (!productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Product id and quantity are required",
      });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // find itemIdx
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    let item = cart.items[itemIndex];

    if (product.stock >= quantity) {
      item.quantity += quantity;
      // if itemQuantity -> 0 DELET Item
      if (item.quantity < 1) {
        cart.items.splice(itemIndex, 1);
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Product on stock not enought" });
    }
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getCartProducts = async (req, res, next) => {
  try {
    const userId = req.userId;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });
    }

    const cartProducts = cart.items.map((item) => ({
      productId: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      quantity: item.quantity,
    }));
    res.json({ success: true, cart: cartProducts });
  } catch (error) {
    console.error("Error fetching cart products:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const removeProductFromCart = async (req, res, next) => {
  try {
    const { productId } = req.body; 
    const userId = req.userId; 

    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID is required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    cart.items.splice(itemIndex, 1);

    cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await cart.save();

    res.json({ success: true, message: "Product removed from cart", cart });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  addItemToCart,
  removeAllFromCart,
  updateQuantity,
  getCartProducts,
  removeProductFromCart
};
