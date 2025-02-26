const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    roomId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String, enum: ["solo", "group"], required: true },
    pdfUrl: { type: String, default: null },
});

module.exports = mongoose.model("Room", RoomSchema);
