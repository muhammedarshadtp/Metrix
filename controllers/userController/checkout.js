const { ObjectId } = require("mongodb");
const cartCollection = require("../../model/cart-schema");
const addressCollection = require("../../model/user-address");



const checkout = async (req, res) => {
    try {


        const user = req.session.isAuth
        const Id = req.session.userId

        const cart = await cartCollection.findOne({ userId: new ObjectId(Id) }).populate("items.productId")
        console.log(cart);
        const address = await addressCollection.find({userId:Id}) 
        console.log(address,"addresss data is showingggg");

        

        if (!cart || !cart.items.length) {
            return res.redirect('/cartpage');
        }

        res.render('checkout', { cart, user,address,
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
        res.redirect('/error_page', "checkout page error")
    }

}






module.exports = {
    checkout,
    
   
}