const { ObjectId } = require("mongodb");
const cartCollection = require("../../model/cart-schema");
const addressCollection = require("../../model/user-address");
const walletCollection = require("../../model/wallet-schema");
const couponCollection = require("../../model/coupon-schema");
const wishlistCollection = require("../../model/wishlist-schema");



const checkout = async (req, res) => {
    try {


        const user = req.session.isAuth
        const userId = req.session.userId

        const cart = await cartCollection.findOne({ userId: userId }).populate("items.productId")
      
        const address = await addressCollection.find({userId:userId}) 
        

        const wallet = await walletCollection.findOne({userId:userId})

        const coupon = await couponCollection.find()

        const wishlist =await wishlistCollection.findOne({userId:userId}).populate("item.productId")
       
       

        

        if (!cart || !cart.items.length) {
            return res.redirect('/cartpage');
        }

        res.render('checkout', { cart, user,address,wallet,coupon,wishlist,
            nameError: req.flash('nameError'),
            countryError: req.flash('countryError'),
            addressError: req.flash('addressError'),
            streetError: req.flash('streetError'),
            cityError: req.flash('cityError'),
            stateError: req.flash('stateError'),
            pincodeError: req.flash('pincodeError'),
            phoneError: req.flash('phoneError'),
         })
    } catch (error) {
        console.log(error);
        res.render('/error_page', "checkout page error")
    }

}






module.exports = {
    checkout,
    
   
}