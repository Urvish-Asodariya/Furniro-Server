const mongoose=require("mongoose");
const ReviewSchema=mongoose.Schema({
    ratings:{
        type:Number
    },
    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }
});
module.exports=mongoose.model("Review",ReviewSchema);