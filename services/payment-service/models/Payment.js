const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    bookingId: {
      type: String,
      required: true,
    },

    cabFare: {
      type: Number,
      required: true,
    },

    cabMultiplier: {
      type: Number,
      required: true,
    },

    daytimeMultiplier: {
      type: Number,
      required: true,
    },

    passengersMultiplier: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 1,
    },

    discountApplied: {
      type: Boolean,
      default: false,
    },

    discountPercent: {
      type: Number,
      default: 0,
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "paid",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Payment", paymentSchema);