const productsCollection = require("../../model/products-schema")




const products = async (req, res) => {
    try {
        
        const limit = 6; 
        let page = Number(req.query.page) || 1; 

        const TOTAL_COUNT_OF_PRODUCT = await productsCollection.countDocuments()
        const totalPages = Math.ceil(TOTAL_COUNT_OF_PRODUCT / limit)
        page = Math.max(1,Math.min(page,totalPages))

        const skip = (page - 1) * limit;


        const products = await productsCollection.find().skip(skip).limit(limit)
        res.render('adminProducts', { products,page,totalPages,count:TOTAL_COUNT_OF_PRODUCT })
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