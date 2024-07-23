const { render } = require("ejs")
const catagoryCollection = require("../../model/catagory-schema")
const productsCollection = require("../../model/products-schema")
const {AlphaOnly,onlyNumbers} =require('../../utils/validation/adminValidation')


const addproducts = async (req, res) => {

    try {
        const catagory = await catagoryCollection.find()
        res.render('addNewProducts', { catagory: catagory,
            nameError:req.flash('nameError'),
            stockError:req.flash('stockError'),
            discError:req.flash('discError'),
            priceError:req.flash('priceError'),
        })
    } catch (error) {
        console.log("addproducts error");
        return res.render('error-page')
    }
}

const addproductspost = async (req, res) => {

    try {
        const catagory= await catagoryCollection.findOne({_id:req.body.catagory})
        let catagoryOffer=catagory.catagoryOffer
       const data = req.body;
    
        console.log(data,'data kitty');
       const nameValid=AlphaOnly(data.name)
       console.log(nameValid);
       const discValid=AlphaOnly(data.description)
       const stockValid=onlyNumbers(data.stock)
       const priceValid=onlyNumbers(data.price)
        if(!nameValid){
            req.flash('nameError','Product name must be at least 3 characters long')
            return res.redirect('/admin/adminaddproducts')
        }
        else if(!stockValid){
            req.flash('stockError','Stock must be a positive integer')
            return res.redirect('/admin/adminaddproducts')
        }
        else if(!discValid){
            req.flash('discError','Product description must be at least 4 characters long')
            return res.redirect('/admin/adminaddproducts')
        }
        else if(!priceValid){
            req.flash('priceError','Price must be a positive number')
            return res.redirect('/admin/adminaddproducts')
        }
         // Validate images
         else if (!req.files || req.files.length === 0) {
            req.flash('error_MSG', 'Please upload at least one image');
            return res.redirect('/admin/adminaddproducts');
        
        }

        else{
        console.log(req.file,'==================');

        let imageMultiple = []
        let count = 0
        console.log(req.files.filename);
        for (const file of req.files) {
            imageMultiple[count] = file.filename
            count++
        }
        console.log(imageMultiple,'imageMultiple is shiwubg');

        const {productOffer,price} = req.body
        let productOfferPrice = Number(price)
        let catagoryOfferPrice = Number(price)
        if(productOffer){
            productOfferPrice -= ( Number(price) * Number(productOffer) /100)
        }
        if(catagoryOffer){
            catagoryOfferPrice -= ( Number(price) * Number(catagoryOffer) /100)
        }
        updatedPrice =  Math.min(productOfferPrice,catagoryOfferPrice)
        console.log(catagoryOfferPrice,'cata offer');
        console.log(productOfferPrice,'product offer price showing ');
        const productsdatas = {
            name: req.body.name,
            catagory:catagory,
            description: req.body.description,
            stock: req.body.stock,
            price: updatedPrice,
            images: imageMultiple,
            originalPrice:req.body.price
        }


        console.log(productsdatas);
        

        const products = await productsCollection.insertMany([productsdatas])
        console.log(products, "productsupload successfully");
        
        res.redirect('/admin/products')
    }
    } catch (error) {
        console.log(error,"add products post error");
    }
}



module.exports = {
    addproducts,
    addproductspost
}