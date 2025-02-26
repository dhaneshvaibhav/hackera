const mongoose=require("mongoose")

const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        trim:true
    }
 });
 const UserInfo=mongoose.model("UserInfo",UserSchema)
 module.exports=UserInfo;