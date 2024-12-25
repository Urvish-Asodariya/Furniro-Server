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
    total: {
        type: Number
    },
    status:{
        type:String,
        enum:["Pending","Shipped","Delivered"],
        default:"Pending"
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
});
module.exports = mongoose.model("Order", OrderSchema);
