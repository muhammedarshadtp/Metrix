const Razorpay = require('razorpay')
const userCollection = require('../../model/user-schema')
const cartCollection = require('../../model/cart-schema')
const wishlistCollection = require('../../model/wishlist-schema')
const dotenv = require('dotenv').config()


const razorpay = async (req, res) => {
    try {

        let instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY,
            key_secret: process.env.RAZORPAY_SECRET
        })

        let amountstr
        if(req.session.finalprice){
            amountstr = req.session.finalprice
            console.log(amountstr,'sdjkghsdfukg');
        }else{

            amountstr = req.query.amount
        }
        const amount = Number(amountstr) * 100
        console.log(amount);
        console.log(typeof amount);

        console.log('ethty mone');
        const orders = await instance.orders.create({
            "amount": amount,
            "currency": "INR",
            "receipt": "receipt#1",
        })
        console.log(orders, 'orders is showing');
        res.json(orders)
    } catch (error) {
        console.log(error, 'razorpay error is showing ');
        return res.redirect('/error_page')
    }
}

const retryPayment = async (req,res)=>{
    try {

        const userId = req.session.userId

        const user = await userCollection.find()
        const cart = await cartCollection.find()
        const wishlist = await wishlistCollection.findOne({userId:userId})
        
        res.render('retryPayment',{user,cart,wishlist})
    } catch (error) {
        console.log(error);
        return res.redirect('/error_page')
    }
}

module.exports = {
    razorpay,
    retryPayment,
}