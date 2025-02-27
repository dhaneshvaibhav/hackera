const express = require("express");
const { nanoid } = require("nanoid");
const multer = require("multer");
const Room = require("../models/Rooms");
const { getRouterRtpCapabilities } = require("../utils/mediasoupSetup");
const { uploadFileToCloudinary } = require("../utils/cloudinaryHelper"); // Cloudinary Upload Helper

const router = express.Router();

// Multer Configuration: Store files in memory before Cloudinary upload
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed!"), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB file size limit
});

// Create Room API
router.post("/", upload.single("pdfFile"), async (req, res) => {
    try {
        const { name, type } = req.body;

        if (!name || !type || !["solo", "group"].includes(type)) {
            return res.status(400).json({ error: "Invalid input data" });
        }

        const roomId = nanoid(6);
        let pdfUrl = null;

        if (req.file) {
            try {
                pdfUrl = await uploadFileToCloudinary(req.file, "pdfs");
            } catch (uploadError) {
                console.error("❌ PDF Upload Error:", uploadError);
                return res.status(500).json({ error: "Failed to upload PDF" });
            }
        }

        const newRoom = new Room({ roomId, name, type, pdfUrl });
        await newRoom.save();

        console.log(`✅ Room Created: ${roomId}`);

        let rtpCapabilities;
        try {
            rtpCapabilities = await getRouterRtpCapabilities();
        } catch (rtpError) {
            console.error("❌ Error fetching RTP Capabilities:", rtpError);
            return res.status(500).json({ error: "Failed to retrieve RTP Capabilities" });
        }

        res.status(201).json({ roomId, name, type, pdfUrl, rtpCapabilities });
    } catch (error) {
        console.error("❌ Error creating room:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
