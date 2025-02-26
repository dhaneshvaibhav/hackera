const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
const { nanoid } = require("nanoid");
const Room = require("./models/Rooms");
const { startMediasoup, getRouterRtpCapabilities, router } = require("./utils/mediasoupSetup");
const Login =require("./components/login")
const signin =require("./components/signin")



const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;
const connection = process.env.mongoDB;


mongoose.connect(connection)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch((err) => console.error("❌ Error in connecting MongoDB:", err));

app.use(express.json());
app.use(cors({

    origin: 'http://localhost:5173',
    methods: ['GET', 'POST' ,'PUT','DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use("/login",Login);
app.use("/signin",signin);


// Initialize Mediasoup Worker
startMediasoup().then(() => console.log("🚀 Mediasoup Started"));

// API to Create SFU Room
app.post("/create-room", async (req, res) => {
    const roomId = nanoid(6);
    
    const newRoom = new Room({ roomId });
    await newRoom.save();
    
    console.log(`✅ Room Created: ${roomId}`);
    res.json({ roomId, rtpCapabilities: await getRouterRtpCapabilities() });
});

// WebSocket Handling for SFU
io.on("connection", (socket) => {
    console.log(`🔗 New WebSocket Connection: ${socket.id}`);

    socket.on("join-room", async ({ roomId }) => {
        const room = await Room.findOne({ roomId });
        if (!room) return socket.emit("error", "Room not found");

        socket.join(roomId);
        await Room.findOneAndUpdate({ roomId }, { $inc: { users: 1 } });

        console.log(`👤 User ${socket.id} joined room ${roomId}`);
        io.to(roomId).emit("user-count", { users: room.users + 1 });
    });

    socket.on("disconnect", async () => {
        console.log(`❌ User Disconnected: ${socket.id}`);
    });
});

// Start Server
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

