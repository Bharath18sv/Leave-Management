const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    console.log("Auth middleware called with headers:", req.headers);
    const token = req.header("Authorization")?.replace("Bearer ", "");
    console.log("Extracted token:", token);

    if (!token) {
      console.log("No token provided in request");
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    console.log("Verifying token with secret:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    const user = await User.findById(decoded.userId);
    console.log("Found user:", user);

    if (!user) {
      console.log("User not found for token");
      return res.status(401).json({
        success: false,
        message: "Invalid token. User not found.",
      });
    }

    console.log("Setting user in request and calling next");
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

module.exports = authMiddleware;
