const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const leaveRoutes = require("./routes/leave.routes");
const dashboardRoutes = require("./routes/dashboard.routes");

const { errorHandler } = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:3000",
//     credentials: true,
//   })
// );
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan("combined"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  // console.log("Health check...");
  res.status(200).json({ success: true, message: "Server is running!" });
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/employee-leave-db"
  )
  .then(() => {
    console.log("Connected to MongoDB");

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

module.exports = app;
