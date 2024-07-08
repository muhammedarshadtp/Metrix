const catagoryCollection = require("../../model/catagory-schema")
const productsCollection = require("../../model/products-schema")
const { products } = require("./products")
const {AlphaOnly,onlyNumbers,alphanumValid} =require('../../utils/validation/adminValidation')

const productsedit = async(req,res)=>{
   try {
    const productId=req.query.id
    let productsdata;
    if(productId){
         productsdata= await productsCollection.findById(productId).populate('catagory')

         req.session.productsdata=productsdata
    }else{
        productsdata=req.session.productsdata
    }
    console.log(productsdata);
    const catagorydata=await catagoryCollection.find()
    res.render('productsedit',{productsdata:productsdata,catagorydata:catagorydata,
        nameError:req.flash('nameError'),
        stockError:req.flash('stockError'),
        discError:req.flash('discError'),
        priceError:req.flash('priceError'),})
   } catch (error) {
    console.log(error);
   }
}
const productseditPost = async (req, res) => {
    try {
        console.log('==========================');
        const data = req.body;
        console.log(data,'data is showing');
        console.log(data.stock ,'stock data is showing');
        console.log(typeof data.stock ,'stock data is showing');


        const podsId = req.query.podsId;
        const nameValid=alphanumValid(data.name)
        const priceValid=onlyNumbers(data.price)
        const stockValid=onlyNumbers(Number(data.stock))
        const discValid=AlphaOnly(data.description)
         if(!nameValid){
             req.flash('nameError','Product name must be at least 3 characters long')
             return res.redirect('/admin/productsedit')
         }
         else if(!stockValid){
             req.flash('stockError','Stock must be a positive integer')
             return res.redirect('/admin/productsedit')
         }
         else if(!discValid){
             req.flash('discError','Product description must be at least 4 characters long')
             return res.redirect('/admin/productsedit')
         }
         else if(!priceValid){
             req.flash('priceError','Price must be a positive number')
             return res.redirect('/admin/productsedit')
         } 
        
         else if(!req.body.old_images){
            if (!req.files || req.files.length === 0) {
                req.flash('error_MSG', 'Please upload at least one image');
                return res.redirect('/admin/productsedit');
            
            }
        } 
        const allowedTypes = ['image/webp', 'image/jpg', 'image/jpeg', 'image/png'];

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                if (!allowedTypes.includes(file.mimetype)) {
                    req.flash('error_MSG', 'Incorrect file type. Only JPG, PNG, and WEBP files are allowed.');
                    return res.redirect('/admin/productsedit');
                }
            }
        }
            
        
        const product = await productsCollection.findById(podsId);
        console.log(product,'products kitty');
        const catagory = await catagoryCollection.findOne({ name: req.body.catagory });
        console.log(catagory,'catagory kitty');
        

        let updatedImages = req.body.old_images || product.images;

        // If new images are uploaded, handle them
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.filename);
            updatedImages = updatedImages.concat(newImages);
        }

         const {productOffer,price} = req.body
       
         const realprice = price !=product.originalPrice? price:product.originalPrice

            productOfferPrice = Number(realprice) - ( Number(realprice) * Number(productOffer) /100)
        
           
        
        console.log(productOfferPrice,'product offer price showing ');

        const updatedProductData = {
            name: req.body.name,
            catagory: catagory,
            description: req.body.description,
            stock: Number(req.body.stock),
            price: productOfferPrice,
            images: updatedImages,
             originalPrice:realprice,
             productOffer: req.body.productOffer
        };

        const result = await productsCollection.updateOne(
            { _id:podsId },
            { $set: updatedProductData }
        );

        console.log(result);

        res.redirect('/admin/products');
         
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const deleteImages=async(req,res)=>{
    try {
        console.log(req.params);
        const imagesdelete = await productsCollection.updateOne(
            { _id: req.params.id },
            { $pull: { images: req.params.images } } // Correct structure for $pull
          );          
     console.log(imagesdelete,'vsdhfghg');
     res.redirect(`/admin/productsedit?id=${req.params.id}`)
    } catch (error) {
        
    }
}



module.exports={
    productsedit,
    productseditPost,
    deleteImages,
    
}