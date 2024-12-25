const mongoose = require("mongoose");

const SizeSchema = mongoose.Schema({
    size: {
        type: Array,
        required: true
    },
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
});

module.exports = mongoose.model("Size", SizeSchema);
