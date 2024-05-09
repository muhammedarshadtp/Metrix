const mongoose = require('mongoose')

const catagoryschema= mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type:Boolean,
        default:true,
    }



})

const catagoryCollection= mongoose.model('catagory',catagoryschema)

module.exports=catagoryCollection