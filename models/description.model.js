const mongoose=require("mongoose");
const DescriptionSchema=mongoose.Schema({
    
    details:{
        type:String
    },
    desc_image:{
        type:Array
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
    }
});
module.exports=mongoose.model("Description",DescriptionSchema);