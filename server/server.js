require("dotenv").config();

const express = require("express");

const cors = require("cors");

const mongoose = require("mongoose");

const path = require("path");

const uploadRoutes = require("./routes/uploadRoutes");

const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());

app.use(express.json());

// Serve uploaded files publicly
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

// Auth Routes
app.use(
  "/api/auth",
  authRoutes
);

// File Routes
app.use(
  "/api/files",
  uploadRoutes
);

// Home Route
app.get("/", (req, res) => {
  res.send(
    "Smart Upload Manager Server Running"
  );
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB Connected"
    );
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});