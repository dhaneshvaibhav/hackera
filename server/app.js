const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const connection = process.env.mongoDB;

// Connect to MongoDB
mongoose.connect(connection)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.error("❌ Error connecting to MongoDB:", err));

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

module.exports = app;
