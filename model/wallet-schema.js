const  mongoose  = require("mongoose");
const userCollection = require("./user-schema");


const walletschema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:userCollection,
        required:true
    },
    wallet:{
        type:Number,
        default:0,
    },
    walletTransactions:[
        {
            remarks:{type:String},
            date:{type:Date},
            type:{type:String},
            amount:{typr:Number},
        },
    ],
})


const walletCollection = mongoose.model('wallet',walletschema)

module.exports = walletCollection