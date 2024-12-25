const mongoose=require("mongoose");
const ContactSchema = mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    subject:{
        type:String
    },
    message:{
        type:String
    },
});
module.exports=mongoose.model("Contact",ContactSchema);