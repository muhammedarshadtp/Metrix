

const mongoose = require('mongoose')

const userschema= mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:Boolean,
        default:true,
    },
    admin:{
        type:Boolean,
        default:false
    },
    usedCoupons:[{
        type: String 
    }],


})

const userCollection= mongoose.model('users',userschema)

module.exports=userCollection