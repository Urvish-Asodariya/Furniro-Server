const mongoose = require("mongoose");
const OrderSchema = mongoose.Schema({
    username: {
        type: String
    },
    productname: {
        type: String
    },
    image: {
        type: String
    },
    price: {
        type: Number
    },
    quantity: {
        type: Number,
        min: [1, "Quantity must be at least 1"],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    total: {
        type: Number
    },
    status: {
        type: String,
        enum: ["Pending", "Processing", "Delivered"],
        default: "Pending"
    },
    orderdate: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart"
    }
},
{
    timestamps: true
});
module.exports = mongoose.model("Order", OrderSchema);
