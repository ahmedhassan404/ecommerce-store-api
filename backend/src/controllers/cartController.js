const Cart = require("../models/cart");
const Product = require("../models/product");

const addItemToCart = async(req, res, next) => {
    try {
        // 1. Validate product exists and is in stock
        const { productId, quantity = 1 } = req.body; // Default to 1
        if (!productId) {
            return res.status(400).json({ success: false, message: "Product ID is required" });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ success: false, message: "Product not found" });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ success: false, message: "Out of stock" });
        }

        // 2. Add/update item in the cart
        let cart = await Cart.findOne({ userId: req.userId });
        if (!cart) {
            cart = new Cart({ userId: req.userId });
        }
        const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId
        );
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity, price: product.price });
        }

        // 3. Recalculate total
        cart.total = cart.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
        await cart.save();
        res.json({ success: true, cart });
    } catch (error) {
        console.error("Error adding item to cart:", {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const removeAllFromCart = async(req, res, next) => {
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

const updateQuantity = async(req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.userId;

        // Input validation
        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }
        if (typeof quantity !== 'number' || quantity < 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive number",
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

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        let item = cart.items[itemIndex];

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} items available in stock`
            });
        }

        item.quantity = quantity;

        // Remove item if quantity is 0
        if (item.quantity < 1) {
            cart.items.splice(itemIndex, 1);
        }

        // Recalculate total
        cart.total = cart.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        await cart.save();

        res.json({ success: true, cart });
    } catch (error) {
        console.error("Error updating cart item quantity:", {
            message: error.message,
            stack: error.stack,
            body: req.body
        });
        res.status(500).json({
            success: false,
            message: "Internal server error",
            details: error.message
        });
    }
};

const getCartProducts = async(req, res, next) => {
    try {
        const userId = req.userId;
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) {
            return res
                .status(404)
                .json({ success: false, message: "Cart not found" });
        }

        // Filter out items with missing or invalid product data
        const cartProducts = cart.items
            .filter(item => item.productId && typeof item.productId.price === 'number')
            .map((item) => ({
                productId: item.productId._id,
                name: item.productId.name || 'Unknown Product',
                price: item.productId.price,
                image: item.productId.image || '/placeholder.jpg',
                quantity: item.quantity,
            }));

        // Optionally, clean the cart by removing invalid items
        cart.items = cart.items.filter(item => item.productId && typeof item.productId.price === 'number');
        cart.total = cartProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);
        await cart.save();

        res.json({ success: true, cart: cartProducts });
    } catch (error) {
        console.error("Error fetching cart products:", {
            message: error.message,
            stack: error.stack,
        });
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const removeProductFromCart = async(req, res, next) => {
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