const mongoose = require("mongoose");
const CartSchema = mongoose.Schema({
    image: {
        type: String
    },
    name: {
        type: String
    },
    price: {
        type: Number
    },
    size: {
        type: String
    },
    color: {
        type: String
    },
    category: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    quantity: {
        type: Number
    },
    subtotal: {
        type: Number
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required:true
    }
});
module.exports = mongoose.model("Cart", CartSchema);