const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

const connectDB = require("./config/db");
const Booking = require("./models/Booking");

dotenv.config({ path: "../../.env" });
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Booking service is running");
});

app.post("/api/bookings", async (req, res) => {
  try {
    const {
      userId,
      startLocation,
      endLocation,
      dateTime,
      passengers,
      cabType,
      estimatedPrice,
      basePrice,
      discountApplied,
      discountPercent,
      discountMultiplier,
    } = req.body;

    if (Number(passengers) > 8) {
      return res.status(400).json({ message: "Maximum 8 passengers allowed" });
    }

    const booking = await Booking.create({
      userId,
      startLocation,
      endLocation,
      dateTime,
      passengers,
      cabType,
      estimatedPrice,
      basePrice,
      discountApplied,
      discountPercent,
      discountMultiplier,
    });

    setTimeout(async () => {
      try {
        await axios.post(
          `${process.env.CUSTOMER_SERVICE_URL}/api/customers/${userId}/notifications`,
          {
            title: "Cab Ready",
            message: `Your cab from ${startLocation} to ${endLocation} is ready for pickup.`,
          }
        );
      } catch (error) {
        console.log("Cab ready notification failed:", error.message);
      }
    }, 3 * 60 * 1000);

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error: error.message });
  }
});

app.get("/api/bookings/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).sort({
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

app.get("/api/bookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Could not get booking",
      error: error.message,
    });
  }
});

app.put("/api/bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { returnDocument: "after" }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Could not update booking",
      error: error.message,
    });
  }
});

const PORT = process.env.BOOKING_SERVICE_PORT || 5002;

app.listen(PORT, () => {
  console.log(`Booking service running on port ${PORT}`);
});