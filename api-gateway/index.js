const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const CUSTOMER_SERVICE_URL =
  process.env.CUSTOMER_SERVICE_URL || "http://localhost:5001";

const BOOKING_SERVICE_URL =
  process.env.BOOKING_SERVICE_URL || "http://localhost:5002";

const FARE_SERVICE_URL =
  process.env.FARE_SERVICE_URL || "http://localhost:5003";

const LOCATION_SERVICE_URL =
  process.env.LOCATION_SERVICE_URL || "http://localhost:5004";

const PAYMENT_SERVICE_URL =
  process.env.PAYMENT_SERVICE_URL || "http://localhost:5005";

app.get("/", function (req, res) {
  res.json({ message: "API Gateway is running" });
});

async function forwardRequest(req, res, serviceUrl) {
  try {
    const fullUrl = serviceUrl + req.originalUrl;

    const response = await axios({
      method: req.method,
      url: fullUrl,
      data: req.body,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    let statusCode = 500;
    let errorData = {
      message: "Gateway error",
      error: error.message,
    };

    if (error.response) {
      statusCode = error.response.status;
      errorData = error.response.data;
    }

    res.status(statusCode).json(errorData);
  }
}

app.use("/api/customers", function (req, res) {
  forwardRequest(req, res, CUSTOMER_SERVICE_URL);
});

app.use("/api/bookings", function (req, res) {
  forwardRequest(req, res, BOOKING_SERVICE_URL);
});

app.use("/api/fares", function (req, res) {
  forwardRequest(req, res, FARE_SERVICE_URL);
});

app.use("/api/locations", function (req, res) {
  forwardRequest(req, res, LOCATION_SERVICE_URL);
});

app.use("/api/payments", function (req, res) {
  forwardRequest(req, res, PAYMENT_SERVICE_URL);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log("API Gateway running on port " + PORT);
});