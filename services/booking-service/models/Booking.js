const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    startLocation: {
      type: String,
      required: true,
    },

    endLocation: {
      type: String,
      required: true,
    },

    dateTime: {
      type: Date,
      required: true,
    },

    passengers: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },

    cabType: {
      type: String,
      enum: ["Economic", "Premium", "Executive"],
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "paid", "completed"],
      default: "pending",
    },

    basePrice: {
      type: Number,
      default: 0,
    },

    estimatedPrice: {
      type: Number,
      default: 0,
    },

    discountApplied: {
      type: Boolean,
      default: false,
    },

    discountPercent: {
      type: Number,
      default: 0,
    },

    discountMultiplier: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);