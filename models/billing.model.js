const mongoose = require("mongoose");

const BillingSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    company: {
        type: String
    },
    country: {
        type: String
    },
    street_address: {
        type: String
    },
    city: {
        type: String
    },
    province: {
        type: String
    },
    zipcode: {
        type: String
    },
    phone: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    additional: {
        type: String
    },
    productname: {
        type: String
    },
    quantity: {
        type: Number
    },
    total: {
        type: Number
    },
    status: {
        type: String,
        enum: ["pending", "cancled", "completed"],
        default: "pending"
    },
    paymentSessionId: { 
        type: String 
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    discountApplied: {   
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Billing", BillingSchema);
