const http = require("http");
const socketIo = require("socket.io");

const express=require("express")
const getData=require("../server/components/getData")

const { startMediasoup } = require("./utils/mediasoupSetup");
const app = require("./app");


const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;

app.use(express.json()); // ✅ This enables JSON request body parsing

app.use("/getData",getData);
app.use("/joinRoom",require("../server/components/joinRoom"))
app.use("/gettingData",require("../server/components/gettingData"))

// Routes
app.use("/login", require("./components/login"));
app.use("/signin", require("./components/signin"));
app.use("/create-room", require("./components/createRoom"));

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
