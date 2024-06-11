const { ObjectId } = require("mongodb");
const cartCollection = require("../../model/cart-schema");
const userCollection = require("../../model/user-schema");
const addressCollection = require("../../model/user-address");
const { bnameValid, adphoneValid, pincodeValid, } = require("../../utils/validation/addressValidation");
const catagoryCollection = require("../../model/catagory-schema");



const checkout = async (req, res) => {
    try {


        const user = req.session.isAuth
        const Id = req.session.userId

        const cart = await cartCollection.findOne({ userId: new ObjectId(Id) }).populate("items.productId")

        const address = await addressCollection.find({user:Id}) 
        console.log(address,"userdata");

        

        if (!cart || !cart.items.length) {
            return res.redirect('/cartpage');
        }

        res.render('checkout', { cart, user,address })
    } catch (error) {
        res.redirect('/error_page', "checkout page error")
    }

}

const checkoutPost = async (req, res) => {
    try {
        console.log('keruninde');
        const data = {
            name,
            country,
            address,
            street,
            city,
            state,
            pincode,
            phone,
        } = req.body;

        console.log(req.body);

        const cartId = req.body.cartId
        req.session.chadInfo = req.body;
        const Id = req.session.userId

        const existingUser = await userCollection.findOne({ _id: Id })
        console.log(existingUser, 'varuninde');

        const namevalid = bnameValid(name)
        const countryValid = bnameValid(country)
        const addressvalid = pincodeValid(address)
        const streetValid = bnameValid(street)
        const cityValid = bnameValid(city)
        const stateValid = bnameValid(state)
        const pincodevalid = pincodeValid(pincode)
        const phoneValid = adphoneValid(phone)

        if (!namevalid) {
            req.flash("nameerror", "Enter a valid name")
            return res.redirect("/checkout")
        }
        if (!countryValid) {
            req.flash("countryerror", 'Enter valid country')
            return res.redirect("/checkout")
        }
        if (!addressvalid) {
            req.flash("addressvaliderror", 'Enter valid address')
            return res.redirect("/checkout")
        }
        if (!streetValid) {
            req.flash("streeterror", "enter a valid street")
            return res.redirect("/checkout")

        }
        if (!cityValid) {
            req.flash("cityerror", "Enter Valid City")
            return res.redirect("/checkout")

        }
        if (!stateValid) {
            req.flash("stateerror", "Enter valid state")
            return res.redirect("/checkout")
        }

        if (!pincodevalid) {
            req.flash("pincodeerror", "Enter a valid Pincode")
            return res.redirect("/checkout")
        }
        if (!phoneValid) {
            req.flash("phoneerror", "Enter valid phone ")
            return res.redirect("/checkout")

        }

        if (existingUser) {
            const existingAddress = await userCollection.findOne({
                '_id': Id,
                'address': {
                    $elemMatch: {
                        'name': name,
                        'country': country,
                        'address': address,
                        'street': street,
                        'city': city,
                        'state': state,
                        'pincode': pincode,
                        'phone': phone,
                    }
                }
            });
            if (existingAddress) {
                return res.redirect(`/checkout?cartId=${cartId}`)
            }
            req.session.chadInfo = null
            existingUser.address.push({
                name: name,
                country: country,
                address: address,
                street: street,
                city: city,
                state: state,
                pincode: pincode,
                phone: phone,
            })
            await existingUser.save()
        }

        const catagories = await catagoryCollection.find()
        console.log(catagories, 'cata ktty');
        const addresslist = await userCollection.findOne({ _id: Id })
        console.log(addresslist, 'addresskitty');

        if (!addresslist) {
            console.log('user not found');
            res.redirect('/error_page')
        }

        const addresses = addresslist.address
        if (!cartId) {
            console.log('cartId not found');
            res.redirect('/error_page')
        }

        const cart = await cartCollection.findById(cartId).populate("items.productId")

        if (!cart) {
            console.log("cart not found");
            res.redirect('/error_page')
        }







        res.render('checkout', { addresses, cart })



    } catch (error) {
        console.log(error, 'checkout post  error');
        return res.render('error_page')
    }

}


module.exports = {
    checkout,
    checkoutPost,
}