const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Coupon code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ["Percentage (%)", "Fixed Amount (₹)"],
      default: "Percentage (%)",
    },
    value: {
      type: Number,
      required: [true, "Discount value is required"],
      min: [0, "Discount value cannot be negative"],
    },
    start: {
      type: String,
      default: () => new Date().toISOString().slice(0, 10),
    },
    end: {
      type: String,
      default: "",
    },
    minimum: {
      type: Number,
      default: 0,
      min: 0,
    },
    limit: {
      type: Number,
      default: 0,
      min: 0,
    },
    used: {
      type: Number,
      default: 0,
      min: 0,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Coupon", couponSchema);
