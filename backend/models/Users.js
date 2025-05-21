const  mongoose  = require("mongoose");

const UserSchema = new mongoose.Schema({

    userName:{
        type:String,
        required:true,
        unique:true
    },
    firstName: {
        type:String,
        required:true
    },
    
    lastName:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    }

})
const User = mongoose.model("Users",UserSchema)

const AcountSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    balance:{
        type:mongoose.Schema.Types.Number,

    }
})

const Accounts =mongoose.model("Accounts",AcountSchema)
module.exports = {User, Accounts}