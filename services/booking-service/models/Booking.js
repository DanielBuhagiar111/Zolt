const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    dateTime: { type: Date, required: true },
    passengers: { type: Number, required: true },
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);