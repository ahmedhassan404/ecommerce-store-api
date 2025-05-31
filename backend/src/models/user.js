const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const userStatus = require("../utils/enums/userStatus");
const userRole = require("../utils/enums/userRole");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(userRole),
      default: userRole.CUSTOMER,
    },
    profileImage: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(userStatus),
      default: userStatus.ACTIVE,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password") || !this.password) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
