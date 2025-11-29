const User = require("../models/User");
const { generateToken } = require("../utils/tokenUtils");

// Console log for debugging
console.log("Auth controller loaded");

// Register a new user
const register = async (req, res) => {
  try {
    console.log("Register request received:", req.body);
    const { name, email, password, role } = req.body;

    // Check if user already exists
    console.log("Checking if user exists with email:", email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Create new user (only employees can register themselves)
    console.log("Creating new user with data:", { name, email, role });
    const user = new User({
      name,
      email,
      password,
      role: role || "employee", // Default to employee
    });

    await user.save();
    console.log("User created successfully with ID:", user._id);

    // Generate token
    const token = generateToken(user._id);

    console.log("Sending registration response for user:", user._id);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        leaveBalance: user.leaveBalance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: error.message,
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    const { email, password } = req.body;

    // Find user by email
    console.log("Finding user with email:", email);
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    console.log("Checking password for user:", user._id);
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log("Invalid password for user:", user._id);
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        leaveBalance: user.leaveBalance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error logging in",
      error: error.message,
    });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        leaveBalance: user.leaveBalance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
};
