 const mongoose = require('mongoose')
const userCollection = require('./user-schema')



 const addressschema= new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:userCollection,
     
    },
    name:{
        type:String,
    },
    country:{
        type:String,
    },
    address:{
        type:String,
    },
    street:{
        type:String,
    },
    city:{
        type:String,
    },
    state:{
        type:String,
    },
    pincode:{
        type:Number,
    },
    phone:{
        type:String,
    },
 })

 const addressCollection = new mongoose.model('address',addressschema)

 module.exports=addressCollection;