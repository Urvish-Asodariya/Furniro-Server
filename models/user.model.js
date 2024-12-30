const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true, 
    },
    mobile: {
      type: String,
      required: true,  
    },
    email: {
      type: String,
      unique: true,
      required: true,  
    },
    address: {
      type: String,
    },
    zipcode: {
      type: String, 
    },
    city: {
      type: String,
    },
    state: {
      type: String,
    },
    country: {
      type: String,
    },
    password: {
      type: String,
      required: true, 
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["activate", "deactivate", "block"],
      default: "activate",
    },
    wallet: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,  
  }
);

module.exports = mongoose.model("User", UserSchema);
