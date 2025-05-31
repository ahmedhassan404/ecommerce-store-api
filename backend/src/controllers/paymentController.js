const Order = require("../models/order");
const Product = require("../models/product");

const createOrder = async(req, res) => {
    try {
        const { products, totalAmount } = req.body;

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({ error: "Products array is required" });
        }

        // Start a session for transaction
        const session = await Order.startSession();
        session.startTransaction();

        try {
            // Create the order
            const newOrder = new Order({
                user: req.userId,
                products: products.map((product) => ({
                    product: product.product,
                    quantity: product.quantity,
                    price: product.price,
                })),
                totalAmount,
            });

            // Update stock for each product
            for (const item of products) {
                const product = await Product.findById(item.product);

                if (!product) {
                    throw new Error(`Product with ID ${item.product} not found`);
                }

                if (product.stock < item.quantity) {
                    throw new Error(`Insufficient stock for product ${product.name}`);
                }

                product.stock -= item.quantity;
                await product.save({ session });
            }

            // Save the order
            await newOrder.save({ session });

            // Commit the transaction
            await session.commitTransaction();
            session.endSession();

            res.status(201).json({
                success: true,
                message: "Order created successfully",
                order: newOrder,
            });
        } catch (error) {
            // If anything fails, abort the transaction
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).json({
            success: false,
            error: "Failed to create order",
            message: error.message
        });
    }
};

module.exports = {
    createOrder,
};