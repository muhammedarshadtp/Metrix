const productsCollection = require("../../model/products-schema")




const products = async (req, res) => {
    try {
        const products = await productsCollection.find()
        res.render('adminProducts', { products })
    } catch (error) {
        console.log("products error");
    }
}

const admin_manageProducts = async (req, res) => {
    try {

        const productId = req.params.id
        const status = req.query.status
        console.log(`${productId},${status}`);
        console.log(typeof status);
        const product = await productsCollection.findById(productId)
        if (status === 'true') {
            console.log('inside status tre');
           await productsCollection.findByIdAndUpdate(productId, { status: false })
           res.json({success:'hide'})
        } else {
            console.log('insdie else case');
           await productsCollection.findByIdAndUpdate(productId, { status: true })
           res.json({success:'unhide'})
        }
        

    } catch (error) {
        console.log(error,'admin manage product get');
    }
}






module.exports = {
    products,
    admin_manageProducts,
    
}