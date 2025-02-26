const express = require("express");
const jwt = require("jsonwebtoken");
const UserInfo = require("../schema/userinfo")

const router = express.Router();

// Login Route
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate Inputs
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required", value: 0 });
    }

    const user = await UserInfo.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password", value: 1 });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "9h" }
    );

    res.status(200).json({ message: "Login successful", token, value: 2, name: user.name });

  } catch (error) {
    console.error("Error in /login:", error);
    res.status(500).json({ message: "Internal server error", value: 3 });
  }
});

module.exports = router;
