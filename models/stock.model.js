const mongoose = require("mongoose");
const StockSchema = mongoose.Schema({
    stock: {
        type: Number,
        required: true
    },
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
});
module.exports = mongoose.model("Stock", StockSchema);
