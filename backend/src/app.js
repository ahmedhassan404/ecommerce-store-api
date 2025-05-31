const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
// const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const connectDB = require("./config/dbconn");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoute");
const productRoutes = require("./routes/productRoute");
const cartRoutes = require("./routes/cartRoute");
const paymentRoutes = require("./routes/paymentRoute");
const analyticsRoutes = require("./routes/analyticsRoutes");
const categoryRoutes = require("./routes/categoryRoute");
const app = express();

// Middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: 'http://localhost:3000', credentials: true}));

connectDB();
// Routes

app.use("/", authRoutes);
app.use("/api", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/category", categoryRoutes);

app.use(errorHandler);

module.exports = app;
