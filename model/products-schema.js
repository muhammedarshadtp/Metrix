const mongoose = require('mongoose')
const catagoryCollection = require('./catagory-schema')

const productsschema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    catagory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:catagoryCollection,
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
    originalPrice:{
        type:Number,
    },
    status:{
        type:Boolean,
        default:true,
    },
    images:{
        type:Array,
        required:true
    },
    productOffer:{
        type:Number,
    }



})

const productsCollection = new mongoose.model('products',productsschema)

module.exports=productsCollection