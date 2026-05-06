const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.json({ message: "Customer service is running" });
});

app.post("/api/customers/register", async function (req, res) {
  try {
    const firstName = req.body.firstName;
    const surname = req.body.surname;
    const email = req.body.email;
    const password = req.body.password;

    const existingUser = await User.findOne({
      email: email,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName: firstName,
      surname: surname,
      email: email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

app.post("/api/customers/login", async function (req, res) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
      email: email,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        firstName: user.firstName,
        surname: user.surname,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

app.get("/api/customers/:id", async function (req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Could not get user",
      error: error.message,
    });
  }
});

app.get("/api/customers/:id/notifications", async function (req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("notifications");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const notifications = user.notifications.reverse();

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: "Could not get notifications",
      error: error.message,
    });
  }
});

app.post("/api/customers/:id/notifications", async function (req, res) {
  try {
    const userId = req.params.id;
    const title = req.body.title;
    const message = req.body.message;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.notifications.push({
      title: title,
      message: message,
    });

    await user.save();

    res.status(201).json({
      message: "Notification created",
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not create notification",
      error: error.message,
    });
  }
});

app.post("/api/customers/:id/completed-booking", async function (req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.completedBookings = user.completedBookings + 1;

    if (user.completedBookings === 3 && user.hasDiscount === false) {
      user.hasDiscount = true;

      user.notifications.push({
        title: "Discount Available",
        message: "You have completed 3 bookings. A discount is now available!",
      });
    }

    await user.save();

    res.json({
      message: "Completed booking updated",
      completedBookings: user.completedBookings,
      hasDiscount: user.hasDiscount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not update completed booking",
      error: error.message,
    });
  }
});

app.put("/api/customers/:id/use-discount", async function (req, res) {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.hasDiscount = false;

    await user.save();

    res.json({
      message: "Discount marked as used",
      hasDiscount: user.hasDiscount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not update discount",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, function () {
  console.log("Customer service running on port " + PORT);
});