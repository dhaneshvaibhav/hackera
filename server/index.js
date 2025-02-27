const http = require("http");
const socketIo = require("socket.io");
const express = require("express");
const dotenv = require("dotenv");

// Import utilities and components
const { startMediasoup } = require("./utils/mediasoupSetup");
const app = require("./app");
const chatWithAI = require("./components/chatGptBot").chatWithAI; // ✅ Import chatbot function

dotenv.config();

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // ✅ Enable JSON request body parsing

// Routes
app.use("/getData", require("./components/getData"));
app.use("/joinRoom", require("./components/joinRoom"));
app.use("/gettingData", require("./components/gettingData"));
app.use("/login", require("./components/login"));
app.use("/signin", require("./components/signin"));
app.use("/create-room", require("./components/createRoom"));

// ✅ Chatbot Route (AI Chat)
app.post("/chatBot/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) return res.status(400).json({ error: "Message is required" });

        const botReply = await chatWithAI(userMessage); // ✅ Call Gemini AI chatbot function
        res.json({ reply: botReply });
    } catch (error) {
        console.error("Chatbot Error:", error);
        res.status(500).json({ error: "Chatbot service unavailable" });
    }
});

// Initialize Mediasoup Worker
startMediasoup()
    .then(() => console.log("🚀 Mediasoup Started"))
    .catch((err) => console.error("❌ Error starting Mediasoup:", err));

// WebSocket Handling for SFU
require("./sockets/sfu")(io);

// Start Server
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
