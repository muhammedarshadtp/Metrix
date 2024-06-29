const mongoose = require('mongoose')


const couponschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      discount:{
        type:Number,
        required:true
      },
      starting_date:{
        type:Date,
        required:true
      },
      ending_date:{
        type:Date,
        required:true
      },
      minimum_cart_price:{
        type:Number,
        required:true
      },
      maximum_cart_redeem:{
        type:Number,
      },
      description:{
        type:String,
      },
      couponStatus:{
        type:String,
        enum:['ACTIVE','ARCHIVED'],
        default:'ACTIVE'
      }


})

const couponCollection = new mongoose.model('coupon', couponschema)

module.exports = couponCollection;