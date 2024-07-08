const mongoose = require('mongoose');
const userCollection = require('./user-schema');
const productsCollection = require('./products-schema');

const orderschema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: userCollection,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
        unique: true,
    },
    products: [
        {
          productId: {
            type: String,
            required: true
          },
          status: {
            type: String,
            enum: ['Order Placed','Order Cancelled', 'Shipped', 'Delivered','Return Requested','Returned'],
            default: 'Order Placed',
          },
          returnStatus:{
            type: String,
            enum: ['APPROVE', 'REJECTED']
          },
          returnReason:{
            type: String,
          },
          name: {
            type: String,
            required: true,
          },
          images:{
            type:String,
            required:true
          },
          quantity: {
            type: Number,
            required: true,
          },
          price: {
            type: Number,
            required: true,
          }
        },
      ],
    totalPrice: {
        type: Number,
        required: true,
    },
    address: {
        type: Object,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    orderDate: {
        type: Date,
        default: new Date(),
    },
    discountAmount:{
      type:Number,
      
    }

},{timestamps:true});

const orderCollection = new mongoose.model('orders', orderschema);
module.exports = orderCollection;
