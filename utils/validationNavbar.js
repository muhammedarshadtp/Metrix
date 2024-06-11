const { cart } = require("../controllers/userController/userLogin");
const cartCollection = require("../model/cart-schema");


const whishlistcart = async(req,res,next)=>{
    try {

        const userId = req.session.isAuth;
       
        if (!userId) {
            return next();
        }

        // let whishlistData = await whishlistCollection.findOne({userId:userId._id}).populate('items')
        let cartData = await cartCollection.findOne({userId:req.session.userid}).populate('items.productId')
        if (!cartData) {
            cartData = { items: [], Cart_total: 0 };
        }
        // if(!whishlistData){
        //     whishlistData = { items:[]};
        // }
       
        // res.locals.whishlistData = whishlistData
        res.locals.cart = cartData
        next();

    } catch (error) {
        console.error('Error in whishlistcart:', error);
        res.redirect('/userError')
    }  
}


module.exports = {
whishlistcart
}