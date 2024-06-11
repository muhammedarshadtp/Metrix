const cartCollection = require("../../model/cart-schema");
const productsCollection = require("../../model/products-schema");


const products = async (req, res) => {
    try {
        const user = req.session.isAuth
        let cart  = await cartCollection.find({}).populate("items.productId");
        const product = await productsCollection.find({ status: true }).populate("catagory")
        const products = product.filter(product => product.catagory.status === true)
        cart=cart[0]
        res.render('products', { data: products, user,cart })
    } catch (error) {
        console.log('products keri');
        return res.render('error_page')
    }

}


const productDetail = async (req, res) => {
    try {
        const user = req.session.isAuth
        const productData = req.params.id
        let cart  = await cartCollection.find({}).populate("items.productId");
        const productDetail = await productsCollection.findOne({ _id: productData }).populate("catagory")
        console.log(productDetail, '---------------------------data is founded...');
        cart=cart[0]
        res.render('productDetail', { data: productDetail, user,cart})
    } catch (error) {
        console.log('productsDetails keri');
        return res.render(' error_page')

    }

}

module.exports={
    productDetail,
    products,

}