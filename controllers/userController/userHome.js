const cartCollection = require("../../model/cart-schema");
const productsCollection = require("../../model/products-schema");
const userCollection = require("../../model/user-schema");



const home = async (req, res) => {
    try {
        const user = req.session.isAuth
        const id = req.session.userid
        const userDetail = await userCollection.find({ _id: id })
    
            let cart=await cartCollection.findOne({}).populate("items.productId");
            console.log(cart.items.length,'length');
            cartCount = cart.items.length
            const product = await productsCollection.find({ status: true }).populate("catagory")
            const products = product.filter(product => product.catagory.status === true)
            
             res.render('user_home', { products, user ,cart,cartCount})

    } catch (error) {
        console.log(error);
    }
}

module.exports={
    home,
}