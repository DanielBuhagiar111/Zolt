const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const axios = require("axios");

const connectDB = require("./config/db");
const Location = require("./models/Location");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.json({ message: "Location service is running" });
});

app.post("/api/locations", async function (req, res) {
  try {
    const userId = req.body.userId;
    const name = req.body.name;
    const address = req.body.address;

    const location = await Location.create({
      userId: userId,
      name: name,
      address: address,
    });

    res.status(201).json({
      message: "Location added successfully",
      location: location,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not add location",
      error: error.message,
    });
  }
});

app.get("/api/locations/user/:userId", async function (req, res) {
  try {
    const userId = req.params.userId;

    const locations = await Location.find({
      userId: userId,
    });

    const locationsWithWeather = await Promise.all(
      locations.map(async function (location) {
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

          const locationObject = location.toObject();

          locationObject.weather = {
            locationName: weatherResponse.data.location.name,
            country: weatherResponse.data.location.country,
            condition: weatherResponse.data.current.condition.text,
            temperature: weatherResponse.data.current.temp_c,
            feelsLike: weatherResponse.data.current.feelslike_c,
            humidity: weatherResponse.data.current.humidity,
            windKph: weatherResponse.data.current.wind_kph,
            icon: weatherResponse.data.current.condition.icon,
          };

          return locationObject;
        } catch (error) {
          let errorMessage = error.message;

          if (error.response) {
            errorMessage = error.response.data;
          }

          console.log("Weather error:", errorMessage);

          const locationObject = location.toObject();

          locationObject.weather = {
            error: "Weather unavailable for this location",
          };

          return locationObject;
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

app.get("/api/locations/weather", async function (req, res) {
  try {
    const q = req.query.q;

    if (!q) {
      return res.status(400).json({
        message: "Location query is required. Example: ?q=London",
      });
    }

    const weatherResponse = await axios.get(
      "https://weatherapi-com.p.rapidapi.com/current.json",
      {
        params: {
          q: q,
        },
        headers: {
          "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
          "X-RapidAPI-Host": process.env.WEATHER_API_HOST,
        },
      }
    );

    res.json(weatherResponse.data);
  } catch (error) {
    let errorMessage = error.message;

    if (error.response) {
      errorMessage = error.response.data;
    }

    res.status(500).json({
      message: "Weather API failed",
      error: errorMessage,
    });
  }
});

app.put("/api/locations/:id", async function (req, res) {
  try {
    const locationId = req.params.id;
    const name = req.body.name;
    const address = req.body.address;

    const location = await Location.findByIdAndUpdate(
      locationId,
      {
        name: name,
        address: address,
      },
      {
        returnDocument: "after",
      }
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

app.delete("/api/locations/:id", async function (req, res) {
  try {
    const locationId = req.params.id;

    const location = await Location.findByIdAndDelete(locationId);

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

app.get("/api/locations/coordinates", async function (req, res) {
  try {
    const q = req.query.q;

    if (!q) {
      return res.status(400).json({
        message: "Location query is required.",
      });
    }

    const response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          q: q,
          key: process.env.OPENCAGE_API_KEY,
          limit: 1,
        },
      }
    );

    if (response.data.results.length === 0) {
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
    let errorMessage = error.message;

    if (error.response) {
      errorMessage = error.response.data;
    }

    console.log(errorMessage);

    res.status(500).json({
      message: "Could not get coordinates",
      error: errorMessage,
    });
  }
});

const PORT = process.env.PORT || 5004;

app.listen(PORT, function () {
  console.log("Location service running on port " + PORT);
});