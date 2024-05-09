const catagoryCollection = require("../../model/catagory-schema")
const productsCollection = require("../../model/products-schema")



const addproducts = async (req, res) => {

    try {
        const catagory = await catagoryCollection.find()
        res.render('addNewProducts', { catagory: catagory })
    } catch (error) {
        console.log("addproducts error");
    }
}

const addproductspost = async (req, res) => {

    try {
        let imageMultiple = []
        let count = 0
        console.log(req.files.filename);
        for (const file of req.files) {
            imageMultiple[count] = file.filename
            count++
        }
        console.log(imageMultiple,'imageMultiple is shiwubg');
        const productsdatas = {
            name: req.body.name,
            catagory: req.body.catagory,
            description: req.body.description,
            stock: req.body.stock,
            price: req.body.price,
            images: imageMultiple,
        }

        console.log(productsdatas);
        const products = await productsCollection.insertMany([productsdatas])
        console.log(products, "productsupload successfully");
        // const file = req.file
        // const imageFileName = req.file.filename
        // console.log(file, 'file data============================');
        // console.log(productsdatas, 'productsdatas');
        res.redirect('/admin/products')
    } catch (error) {
        console.log("add products post error");
    }
}



module.exports = {
    addproducts,
    addproductspost
}