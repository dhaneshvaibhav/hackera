const express = require("express");
const Room = require("../models/Rooms"); // ✅ Import Room model from DB (Adjust path if needed)

const router = express.Router();

// Join an existing room
router.post("/", async (req, res) => {
    const { roomId } = req.body;

    // Debugging: Log incoming data
    console.log("🔍 Checking Room ID:", roomId);

    if (!roomId) {
        return res.status(400).json({ error: "Missing roomId in request body" });
    }

    try {
        // ✅ Fetch room from the database
        const room = await Room.findOne({ roomId });

        if (!room) {
            console.log(`❌ Room ${roomId} not found in DB!`);
            return res.status(404).json({ error: "Room not found" });
        }

        console.log(`✅ Room ${roomId} found! Returning RTP capabilities.`);
        console.log({roomId, rtpCapabilities: room.rtpCapabilities})
        res.json({ roomId, rtpCapabilities: room.rtpCapabilities });
    } catch (error) {
        console.error("❌ Database Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
