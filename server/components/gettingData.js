//getting rooms data
const express = require('express');
const mongoose = require('mongoose');
const Room = require('../models/Rooms'); // Assuming you have a Room model

const router = express.Router();

// Get all room details
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find({}); // Fetch all rooms
        res.status(200).json({ success: true, data: rooms });
        console.log(rooms)
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error });
    }
});

module.exports = router;
