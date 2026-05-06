const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

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

app.get("/", (req, res) => {
  res.json({ message: "API Gateway is running" });
});

const forwardRequest = async (req, res, serviceUrl) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${serviceUrl}${req.originalUrl}`,
      data: req.body,
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(
      error.response?.data || {
        message: "Gateway error",
        error: error.message,
      }
    );
  }
};

app.use("/api/customers", (req, res) => {
  forwardRequest(req, res, CUSTOMER_SERVICE_URL);
});

app.use("/api/bookings", (req, res) => {
  forwardRequest(req, res, BOOKING_SERVICE_URL);
});

app.use("/api/fares", (req, res) => {
  forwardRequest(req, res, FARE_SERVICE_URL);
});

app.use("/api/locations", (req, res) => {
  forwardRequest(req, res, LOCATION_SERVICE_URL);
});

app.use("/api/payments", (req, res) => {
  forwardRequest(req, res, PAYMENT_SERVICE_URL);
});

const PORT = process.env.API_GATEWAY_PORT || 5000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});