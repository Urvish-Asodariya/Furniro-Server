const mongoose = require("mongoose");
const ProductSchema = mongoose.Schema({
    title: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    sku: {
        type: String,
        maxlength: 6
    },
    image: {
        type: Array
    },
    cardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Card',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});
module.exports = mongoose.model("Product", ProductSchema);