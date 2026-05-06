const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

const connectDB = require("./config/db");
const Booking = require("./models/Booking");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.json({ message: "Booking service is running" });
});

app.post("/api/bookings", async function (req, res) {
  try {
    const userId = req.body.userId;
    const startLocation = req.body.startLocation;
    const endLocation = req.body.endLocation;
    const dateTime = req.body.dateTime;
    const passengers = req.body.passengers;
    const cabType = req.body.cabType;
    const estimatedPrice = req.body.estimatedPrice;
    const basePrice = req.body.basePrice;
    const discountApplied = req.body.discountApplied;
    const discountPercent = req.body.discountPercent;
    const discountMultiplier = req.body.discountMultiplier;

    if (Number(passengers) > 8) {
      return res.status(400).json({
        message: "Maximum 8 passengers allowed",
      });
    }

    const booking = await Booking.create({
      userId: userId,
      startLocation: startLocation,
      endLocation: endLocation,
      dateTime: dateTime,
      passengers: passengers,
      cabType: cabType,
      estimatedPrice: estimatedPrice,
      basePrice: basePrice,
      discountApplied: discountApplied,
      discountPercent: discountPercent,
      discountMultiplier: discountMultiplier,
    });

    setTimeout(async function () {
      try {
        await axios.post(
          process.env.CUSTOMER_SERVICE_URL +
            "/api/customers/" +
            userId +
            "/notifications",
          {
            title: "Cab Ready",
            message:
              "Your cab from " +
              startLocation +
              " to " +
              endLocation +
              " is ready for pickup.",
          }
        );
      } catch (error) {
        console.log("Cab ready notification failed:", error.message);
      }
    }, 3 * 60 * 1000);

    res.status(201).json({
      message: "Booking created successfully",
      booking: booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Booking failed",
      error: error.message,
    });
  }
});

app.get("/api/bookings/user/:userId", async function (req, res) {
  try {
    const userId = req.params.userId;

    const bookings = await Booking.find({
      userId: userId,
    }).sort({
      createdAt: -1,
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Could not get bookings",
      error: error.message,
    });
  }
});

app.get("/api/bookings/:id", async function (req, res) {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Could not get booking",
      error: error.message,
    });
  }
});

app.put("/api/bookings/:id/status", async function (req, res) {
  try {
    const bookingId = req.params.id;
    const status = req.body.status;

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        status: status,
      },
      {
        returnDocument: "after",
      }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Could not update booking",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, function () {
  console.log("Booking service running on port " + PORT);
});