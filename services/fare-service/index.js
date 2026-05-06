const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.json({ message: "Fare service is running" });
});

app.post("/api/fares/estimate", async function (req, res) {
  try {
    const dep_lat = req.body.dep_lat;
    const dep_lng = req.body.dep_lng;
    const arr_lat = req.body.arr_lat;
    const arr_lng = req.body.arr_lng;
    const cabType = req.body.cabType;
    const dateTime = req.body.dateTime;
    const passengers = req.body.passengers;

    let discount = req.body.discount;

    if (!discount) {
      discount = 1;
    }

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
          dep_lat: dep_lat,
          dep_lng: dep_lng,
          arr_lat: arr_lat,
          arr_lng: arr_lng,
        },
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": process.env.TAXI_FARE_API_HOST,
        },
      }
    );

    const data = response.data;

    let fareInCents = 0;

    if (
      data &&
      data.journey &&
      data.journey.fares &&
      data.journey.fares[0] &&
      data.journey.fares[0].price_in_cents
    ) {
      fareInCents = data.journey.fares[0].price_in_cents;
    }

    const cabFare = fareInCents / 100;

    let cabMultiplier = 1;

    if (cabType === "Premium") {
      cabMultiplier = 1.2;
    }

    if (cabType === "Executive") {
      cabMultiplier = 1.4;
    }

    const bookingDate = new Date(dateTime);
    const bookingHour = bookingDate.getHours();

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

    let discountApplied = false;
    let discountPercent = 0;

    if (discountMultiplier < 1) {
      discountApplied = true;
      discountPercent = Number(((1 - discountMultiplier) * 100).toFixed(0));
    }

    const discountAmount = basePrice - totalPrice;

    res.json({
      cabFare: Number(cabFare.toFixed(2)),
      cabType: cabType,
      cabMultiplier: cabMultiplier,
      daytimeMultiplier: daytimeMultiplier,
      passengers: Number(passengers),
      passengersMultiplier: passengersMultiplier,

      basePrice: Number(basePrice.toFixed(2)),
      discountMultiplier: discountMultiplier,
      discountApplied: discountApplied,
      discountPercent: discountPercent,
      discountAmount: Number(discountAmount.toFixed(2)),
      totalPrice: Number(totalPrice.toFixed(2)),

      fullData: data,
    });
  } catch (error) {
    let errorMessage = error.message;

    if (error.response) {
      errorMessage = error.response.data;
    }

    console.log(errorMessage);

    res.status(500).json({
      message: "Fare estimation failed",
      error: errorMessage,
    });
  }
});

const PORT = process.env.PORT || 5003;

app.listen(PORT, function () {
  console.log("Fare service running on port " + PORT);
});