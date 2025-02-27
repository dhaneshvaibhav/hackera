const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    streak: {
        type: Number,
        default: 0 // Default streak is 0
    },
    points: {
        type: Number,
        default: 0 // Default points is 0
    },
    lastStrikeDate: {
        type: Date, // Stores the last date streak was updated
        default: null // Default to null (not updated yet)
    }
});

// Create model
const UserInfo = mongoose.model("UserInfo", UserSchema);
module.exports = UserInfo;
