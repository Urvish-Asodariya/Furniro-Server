const mongoose = require("mongoose");
const ProductItemsSchema = mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    discount: {
        type: String
    },
    OriginalPrice: {
        type: Number
    },
    DiscountedPrice: {
        type: Number
    },
    image: {
        type: String
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
});
module.exports = mongoose.model("ProductItems", ProductItemsSchema);