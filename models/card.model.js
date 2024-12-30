const mongoose = require("mongoose");
const CardSchema = mongoose.Schema({
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
        type: Array
    }
});
module.exports = mongoose.model("Card", CardSchema);