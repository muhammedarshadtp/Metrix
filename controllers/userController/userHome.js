const cartCollection = require("../../model/cart-schema");
const productsCollection = require("../../model/products-schema");
const userCollection = require("../../model/user-schema");
const wishlistCollection = require("../../model/wishlist-schema");



const home = async (req, res) => {
    try {
        const user = req.session.isAuth
        const userId = req.session.userId
        const userDetail = await userCollection.find({ _id: userId })

    
            let cart=await cartCollection.findOne({userId:userId}).populate("items.productId");
            // console.log(cart.items.length,'length');
            // let cartCount 
            // if(cart){

            //     cartCount = cart.items.length || 0
            // }
            const cartCount = cart !==  null ? cart.items.length : 0
            const product = await productsCollection.find({ status: true }).populate("catagory")
            const products = product.filter(product => product.catagory.status === true)

            const wishlist = await wishlistCollection.findOne({userId:userId}).populate("item.productId")
            if(wishlist){
                console.log(wishlist,'wishlist===================');
            }
          

            
             res.render('user_home', { products, user ,cart,wishlist})

    } catch (error) {
        console.log(error);
        return res.redirect('/error_page')
    }
}

module.exports={
    home,
}