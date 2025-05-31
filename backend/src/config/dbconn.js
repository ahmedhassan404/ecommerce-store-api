const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log(`Database connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
