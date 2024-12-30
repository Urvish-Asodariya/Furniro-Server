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
        type: String
    },
    additional: {
        type: String
    },
    products: [
        {
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            amount: { type: Number, required: true },
        },
    ],
    total: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "canceled", "completed"],
        default: "pending",
    },
    paymentSessionId: {
        type: String
    },
    orderIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    discountApplied: { type: Boolean, default: false },
});

module.exports = mongoose.model("Billing", BillingSchema);
