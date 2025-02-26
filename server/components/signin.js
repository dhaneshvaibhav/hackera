const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserInfo = require("../models/userinfo");

const router = express.Router();

// Signup Route
router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, password, retypePassword } = req.body;

    // Input Validation
    if (!name || !email || !password || !retypePassword) {
      return res.status(400).json({ message: "All fields are required", value: 0 });
    }

    if (password !== retypePassword) {
      return res.status(400).json({ message: "Passwords do not match", value: 1 });
    }

    // Check if email already exists
    console.log("Checking existing user:", email);
    const existingUser = await UserInfo.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists", value: 2 });
    }

    // Hash Password Before Saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log("Saving new user:", email);
    const newUser = new UserInfo({
      name,
      email,
      password: hashedPassword, // Store the hashed password
      isVerified: true,
    });

    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(201).json({ message: "Signup successful!", token, value: 3, name });

  } catch (error) {
    console.error("Error in /signup:", error);
    res.status(500).json({ message: "Internal server error", value: 4 });
  }
});

module.exports = router;
