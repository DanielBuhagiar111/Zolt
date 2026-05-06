const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "Notification",
  },

  message: {
    type: String,
    required: true,
  },

  read: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },

    surname: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    completedBookings: {
      type: Number,
      default: 0,
    },

    hasDiscount: {
      type: Boolean,
      default: false,
    },

    notifications: [notificationSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);