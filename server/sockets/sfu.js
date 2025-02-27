const Room = require("../models/Rooms");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log(`🔗 New WebSocket Connection: ${socket.id}`);

        socket.on("join-room", async ({ roomId }) => {
            try {
                const room = await Room.findOne({ roomId });
                if (!room) {
                    socket.emit("error", "Room not found");
                    return;
                }

                socket.join(roomId);
                await Room.findOneAndUpdate({ roomId }, { $inc: { users: 1 } });
                const updatedRoom = await Room.findOne({ roomId });

                console.log(`👤 User ${socket.id} joined room ${roomId}`);
                io.to(roomId).emit("user-count", { users: updatedRoom.users });
            } catch (error) {
                console.error("❌ Error joining room:", error);
                socket.emit("error", "Internal Server Error");
            }
        });

        socket.on("disconnect", async () => {
            try {
                console.log(`❌ User Disconnected: ${socket.id}`);
                const roomId = Array.from(socket.rooms).find((r) => r !== socket.id);
                if (roomId) {
                    await Room.findOneAndUpdate({ roomId }, { $inc: { users: -1 } });
                    const updatedRoom = await Room.findOne({ roomId });
                    io.to(roomId).emit("user-count", { users: updatedRoom.users });
                }
            } catch (error) {
                console.error("❌ Error handling disconnect:", error);
            }
        });
    });
};
