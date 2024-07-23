const mongoose  = require("mongoose")
const userCollection = require("./user-schema")
const productsCollection = require("./products-schema")




const wishlistschema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:userCollection,
    },
    item: [
        {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: productsCollection,
            required: true,
        },
        images:{
            type: String,
            required: true,
        },
        
        },
    ],

})

const wishlistCollection = new mongoose.model('wishlist',wishlistschema)

module.exports=wishlistCollection