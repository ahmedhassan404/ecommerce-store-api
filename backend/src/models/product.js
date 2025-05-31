const mongoose = require("mongoose");
const productStatus = require("../utils/enums/productStatus");
const { Schema } = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: [{
        url: {
            type: String,
            required: true
        }
    }],
    status: {
        type: String,
        enum: Object.values(productStatus),
        default: productStatus.PENDING,
    },
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    stock: {
        type: Number,
        default: 1,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;