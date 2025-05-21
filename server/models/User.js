const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    Username :{ type : String, required : true,unique : true}
    ,
    Email :{ type : String, required : true,unique : true}
    ,
    Password :{type : String , required : true}
    ,
    IsAdmin :{type:Boolean,default : false}
});
module.exports = mongoose.model("User",userSchema);