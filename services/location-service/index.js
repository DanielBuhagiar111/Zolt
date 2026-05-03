const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

const connectDB = require("./config/db");
const Location = require("./models/Location");

dotenv.config({ path: "../../.env" });
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Location service is running");
});

app.post("/api/locations", async (req, res) => {
  try {
    const { userId, name, address } = req.body;

    const location = await Location.create({
      userId,
      name,
      address,
    });

    res.status(201).json({
      message: "Location added successfully",
      location,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not add location",
      error: error.message,
    });
  }
});

app.get("/api/locations/user/:userId", async (req, res) => {
  try {
    const locations = await Location.find({
      userId: req.params.userId,
    });

    const locationsWithWeather = await Promise.all(
      locations.map(async (location) => {
        try {
          const weatherResponse = await axios.get(
            "https://weatherapi-com.p.rapidapi.com/current.json",
            {
              params: {
                q: location.address,
              },
              headers: {
                "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
                "X-RapidAPI-Host": process.env.WEATHER_API_HOST,
              },
            }
          );

          return {
            ...location.toObject(),
            weather: {
              locationName: weatherResponse.data.location.name,
              country: weatherResponse.data.location.country,
              condition: weatherResponse.data.current.condition.text,
              temperature: weatherResponse.data.current.temp_c,
              feelsLike: weatherResponse.data.current.feelslike_c,
              humidity: weatherResponse.data.current.humidity,
              windKph: weatherResponse.data.current.wind_kph,
              icon: weatherResponse.data.current.condition.icon,
            },
          };
        } catch (error) {
          console.log("Weather error:", error.response?.data || error.message);
          return {
            ...location.toObject(),
            weather: {
              error: "Weather unavailable for this location",
            },
          };
        }
      })
    );

    res.json(locationsWithWeather);
  } catch (error) {
    res.status(500).json({
      message: "Could not get locations",
      error: error.message,
    });
  }
});

app.get("/api/locations/weather", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Location query is required. Example: ?q=London",
      });
    }

    const weatherResponse = await axios.get(
      "https://weatherapi-com.p.rapidapi.com/current.json",
      {
        params: {
          q,
        },
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": process.env.WEATHER_API_HOST,
        },
      }
    );

    res.json(weatherResponse.data);
  } catch (error) {
    res.status(500).json({
      message: "Weather API failed",
      error: error.response?.data || error.message,
    });
  }
});

app.put("/api/locations/:id", async (req, res) => {
  try {
    const { name, address } = req.body;

    const location = await Location.findByIdAndUpdate(
      req.params.id,
      { name, address },
      { returnDocument: "after" }
    );

    if (!location) {
      return res.status(404).json({
        message: "Location not found",
      });
    }

    res.json(location);
  } catch (error) {
    res.status(500).json({
      message: "Could not update location",
      error: error.message,
    });
  }
});

app.delete("/api/locations/:id", async (req, res) => {
  try {
    const location = await Location.findByIdAndDelete(req.params.id);

    if (!location) {
      return res.status(404).json({
        message: "Location not found",
      });
    }

    res.json({
      message: "Location deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete location",
      error: error.message,
    });
  }
});

app.get("/api/locations/coordinates", async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Location query is required.",
      });
    }

    const response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          q,
          key: process.env.OPENCAGE_API_KEY,
          limit: 1,
        },
      }
    );

    if (!response.data.results.length) {
      return res.status(404).json({
        message: "Location not found",
      });
    }

    const result = response.data.results[0];

    res.json({
      formatted: result.formatted,
      lat: result.geometry.lat,
      lng: result.geometry.lng,
    });
  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      message: "Could not get coordinates",
      error: error.response?.data || error.message,
    });
  }
});

const PORT = process.env.LOCATION_SERVICE_PORT || 5004;

app.listen(PORT, () => {
  console.log(`Location service running on port ${PORT}`);
});