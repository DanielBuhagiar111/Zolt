const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

const connectDB = require("./config/db");
const Payment = require("./models/Payment");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.json({ message: "Payment service is running" });
});

app.post("/api/payments", async function (req, res) {
  try {
    const userId = req.body.userId;
    const bookingId = req.body.bookingId;

    const bookingRes = await axios.get(
      process.env.BOOKING_SERVICE_URL + "/api/bookings/" + bookingId
    );

    const booking = bookingRes.data;

    const totalPrice = booking.estimatedPrice;
    const basePrice = booking.basePrice;
    const discountMultiplier = booking.discountMultiplier || 1;
    const discountApplied = booking.discountApplied || false;
    const discountPercent = booking.discountPercent || 0;
    const discountAmount = basePrice - totalPrice;

    const payment = await Payment.create({
      userId: userId,
      bookingId: bookingId,

      cabFare: basePrice,
      cabMultiplier: 1,
      daytimeMultiplier: 1,
      passengersMultiplier: 1,

      discount: discountMultiplier,
      discountApplied: discountApplied,
      discountPercent: discountPercent,
      discountAmount: Number(discountAmount.toFixed(2)),
      totalPrice: totalPrice,
    });

    await axios.put(
      process.env.BOOKING_SERVICE_URL +
        "/api/bookings/" +
        bookingId +
        "/status",
      {
        status: "completed",
      }
    );

    await axios.post(
      process.env.CUSTOMER_SERVICE_URL +
        "/api/customers/" +
        userId +
        "/completed-booking"
    );

    if (discountMultiplier < 1) {
      await axios.put(
        process.env.CUSTOMER_SERVICE_URL +
          "/api/customers/" +
          userId +
          "/use-discount"
      );
    }

    res.status(201).json({
      message: "Payment successful",
      payment: payment,
    });
  } catch (error) {
    let errorMessage = error.message;

    if (error.response) {
      errorMessage = error.response.data;
    }

    console.log("Payment error:", errorMessage);

    res.status(500).json({
      message: "Payment failed",
      error: errorMessage,
    });
  }
});

app.get("/api/payments/user/:userId", async function (req, res) {
  try {
    const userId = req.params.userId;

    const payments = await Payment.find({
      userId: userId,
    }).sort({
      createdAt: -1,
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      message: "Could not get payments",
      error: error.message,
    });
  }
});

app.get("/api/payments/:id", async function (req, res) {
  try {
    const paymentId = req.params.id;

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({
      message: "Could not get payment",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5005;

app.listen(PORT, function () {
  console.log("Payment service running on port " + PORT);
});