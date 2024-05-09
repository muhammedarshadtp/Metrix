const mongoose = require('mongoose')

const productsschema= mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    catagory:{
        type:String,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    status:{
        type:Boolean,
        default:true,
    },
    images:{
        type:Array,
        required:true
    }



})

const productsCollection= mongoose.model('products',productsschema)

module.exports=productsCollection