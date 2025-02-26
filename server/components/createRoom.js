const express = require("express");
const { nanoid } = require("nanoid");
const Room = require("../models/Rooms");
const { getRouterRtpCapabilities } = require("../utils/mediasoupSetup");

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const roomId = nanoid(6);
        const newRoom = new Room({ roomId });
        await newRoom.save();
        console.log(`✅ Room Created: ${roomId}`);
        res.json({ roomId, rtpCapabilities: await getRouterRtpCapabilities() });
    } catch (error) {
        console.error("❌ Error creating room:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
