const express = require("express");
const verifyToken = require("../middleware/verifyToken"); // Middleware for token verification
const router = express.Router();
const UserInfo = require("../models/userinfo");

// 📌 Route to Get User Profile Data (Protected)
router.post("/", verifyToken, async (req, res) => {
  try {
    const email = req.user.email; // Extract user email from JWT
    const userRealData = await UserInfo.findOne({ email });

    if (!userRealData) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User Data Fetched:", userRealData);
    return res.status(200).json({ message: "User data fetched successfully", userRealData });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// 📌 Route to Update Streak & Points when Timer Completes
router.post("/updateStreak", verifyToken, async (req, res) => {
  try {
    const email = req.user.email; // Extract user email from JWT
    const user = await UserInfo.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const today = new Date().toISOString().split("T")[0]; // Get current date (YYYY-MM-DD)
    const lastUpdatedDate = user.lastStrikeDate ? new Date(user.lastStrikeDate).toISOString().split("T")[0] : null;

    // ✅ 1. Update streak only if last update was NOT today
    let streakUpdated = false;
    if (lastUpdatedDate !== today) {
      user.streak = (user.streak || 0) + 1; // Increment streak
      user.lastStrikeDate = new Date(); // Update last streak update date
      streakUpdated = true;
    }

    // ✅ 2. Always increase points every time timer completes
    user.points = (user.points || 0) + 10; // Increase points by 10

    await user.save(); // Save the updated user data

    console.log(`✅ Streak Updated: ${streakUpdated ? user.streak : "Not Updated"}, Points: ${user.points}`);
    return res.status(200).json({
      message: "Streak and points updated successfully!",
      streak: user.streak,
      points: user.points,
      streakUpdated, // Send streak update status to frontend
    });
  } catch (error) {
    console.error("❌ Error updating streak:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
