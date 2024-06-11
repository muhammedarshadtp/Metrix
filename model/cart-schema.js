const mongoose = require('mongoose')
const userCollection = require('./user-schema')
const productsCollection = require('./products-schema')




const cartschema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userCollection,
       
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: productsCollection,
                required: true,
            },
            images: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            Total: {
                type: Number,
                required: true,
            }
        }
    ],
    Total: {
        type: Number,
        required: true,
    },
}, { strictPopulate: false });


const cartCollection = new mongoose.model('cart',cartschema)

module.exports=cartCollection