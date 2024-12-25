const mongoose = require("mongoose");
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    mobile: {
        type: String,
    },
    email: {
        type: String,
        unique: true
    },
    address: {
        type: String
    },
    zipcode: {
        type: Number,
    },
    city: {
        type: String
    },
    state: {
        type: String
    },
    country: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    status: {
        type: String,
        enum: ["activate", "deactivate", "block"],
        default: "activate"
    },
    wallet: {
        type: Number,
        default: 0
    }
},
    {
        timestamps: true
    });
module.exports = mongoose.model("User", UserSchema);