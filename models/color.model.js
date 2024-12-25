const mongoose = require("mongoose");

const ColorSchema = mongoose.Schema({
    code: {
        type: Array,
        required: true
    },
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
});
module.exports = mongoose.model("Color", ColorSchema);
