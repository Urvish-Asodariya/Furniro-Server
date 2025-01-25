const mongoose = require("mongoose");
const sellSchema = mongoose.Schema({
    name: {
        type: String,
    },
    quantity: {
        type: Number
    },
    revenue: {
        type: Number
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
},
    {
        timestamps: true
    });
module.exports = mongoose.model("Sell", sellSchema);