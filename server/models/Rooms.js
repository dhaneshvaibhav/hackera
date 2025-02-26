const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    users: { type: Number, default: 0 }
});

const Room = mongoose.model("Room", RoomSchema);

module.exports = Room;
