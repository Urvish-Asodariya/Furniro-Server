const mongoose = require("mongoose");
const sellSchema = mongoose.Schema({
    name: {
        type: String,
    },
    quantity: {
        type: Number
    }
});
module.exports = mongoose.model("Sell", sellSchema);