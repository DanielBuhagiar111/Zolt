const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config({ path: "../../.env" });

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Fare service is running");
});

app.post("/api/fares/estimate", async (req, res) => {
  try {
    const {
      dep_lat,
      dep_lng,
      arr_lat,
      arr_lng,
      cabType,
      dateTime,
      passengers,
      discount = 1,
    } = req.body;

    if (!dep_lat || !dep_lng || !arr_lat || !arr_lng) {
      return res.status(400).json({
        message: "Departure and arrival coordinates are required.",
      });
    }

    if (!cabType || !dateTime || !passengers) {
      return res.status(400).json({
        message: "Cab type, date/time, and passengers are required.",
      });
    }

    if (Number(passengers) > 8) {
      return res.status(400).json({
        message: "More than 8 passengers are not allowed.",
      });
    }

    const response = await axios.get(
      "https://taxi-fare-calculator.p.rapidapi.com/search-geo",
      {
        params: {
          dep_lat,
          dep_lng,
          arr_lat,
          arr_lng,
        },
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": process.env.TAXI_FARE_API_HOST,
        },
      }
    );

    const data = response.data;

    const fareInCents = data?.journey?.fares?.[0]?.price_in_cents || 0;
    const cabFare = fareInCents / 100;

    let cabMultiplier = 1;

    if (cabType === "Premium") {
      cabMultiplier = 1.2;
    }

    if (cabType === "Executive") {
      cabMultiplier = 1.4;
    }

    const bookingHour = new Date(dateTime).getHours();

    let daytimeMultiplier = 1;

    if (bookingHour >= 0 && bookingHour < 8) {
      daytimeMultiplier = 1.2;
    }

    let passengersMultiplier = 1;

    if (Number(passengers) >= 5 && Number(passengers) <= 8) {
      passengersMultiplier = 2;
    }

    const discountMultiplier = Number(discount);

    const basePrice =
      cabFare * cabMultiplier * daytimeMultiplier * passengersMultiplier;

    const totalPrice = basePrice * discountMultiplier;

    const discountApplied = discountMultiplier < 1;
    const discountPercent = discountApplied
      ? Number(((1 - discountMultiplier) * 100).toFixed(0))
      : 0;

    const discountAmount = basePrice - totalPrice;

    res.json({
      cabFare: Number(cabFare.toFixed(2)),
      cabType,
      cabMultiplier,
      daytimeMultiplier,
      passengers: Number(passengers),
      passengersMultiplier,

      basePrice: Number(basePrice.toFixed(2)),
      discountMultiplier,
      discountApplied,
      discountPercent,
      discountAmount: Number(discountAmount.toFixed(2)),
      totalPrice: Number(totalPrice.toFixed(2)),

      fullData: data,
    });
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      message: "Fare estimation failed",
      error: error.response?.data || error.message,
    });
  }
});

const PORT = process.env.FARE_SERVICE_PORT || 5003;

app.listen(PORT, () => {
  console.log(`Fare service running on port ${PORT}`);
});