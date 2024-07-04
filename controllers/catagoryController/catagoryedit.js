const catagoryCollection = require("../../model/catagory-schema");
const productsCollection = require("../../model/products-schema");
const {AlphaOnly,alphanumValid} =require('../../utils/validation/adminValidation')

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const catagoryedit=async(req,res)=>{
    try {
        const catagoryId =req.params.id
        console.log(req.params.id,"hvhgcbvc");
        const catagorydata= await catagoryCollection.findById(catagoryId)
       console.log(catagorydata);
       res.render("catagoryedit", {
        catagorydata: catagorydata,
        caterror: req.flash('caterror'),
        catDesError: req.flash('catDesError'),
        catNameError: req.flash('catNameError')
      });
      
  

    } catch (error) {
        console.log(error);
    }
    
}

const updatecatagory = async (req, res) => {
    try {
        const data = req.body;
        const id = req.query.id
        console.log(data,"data kitty")

        const existingcatagoryname = await catagoryCollection.findOne({ name:{ $regex: new RegExp("^" + data.name + "$", "i") }})
        
        const catNameValid=alphanumValid(data.name)
        console.log(existingcatagoryname,"ithu exist");
        const descNameValid=alphanumValid(data.description)
        console.log(catNameValid,descNameValid);
         if (!catNameValid) {
            req.flash('catNameError','Invalid category Name')
            return res.redirect(`/admin/catagoryedit/${id}`)
          }
          else if (!descNameValid) {
            console.log("kaarinnnindu");
            req.flash('catDesError','Invalid category Description')
            return res.redirect(`/admin/catagoryedit/${id}`)
          }
        else if(existingcatagoryname&&existingcatagoryname._id.toString()=== id){

          console.log('inside else case');
          const catagorydata= await catagoryCollection.findOne({name:data.name})
          console.log(catagorydata);
          const products = await productsCollection.find({ catagory: catagorydata._id });
          console.log(products,'products is showing ==================');
          for (const product of products) {
            console.log(product,'product is showing');
            const originalPrice = Number(product.originalPrice);
            const catagoryOffer = Number(catagorydata.catagoryOffer);

            const amount = originalPrice - (originalPrice * catagoryOffer / 100) 
            console.log(amount, "amount is showing ");
            const result = await productsCollection.findByIdAndUpdate(product._id, {
              price: amount,
            })
            console.log(result, "result is showing put hand in mine");
  
          }
            await catagoryCollection.updateOne(
                { _id: id },
                { name: data.name, description: data.description,catagoryOffer:data.catagoryOffer }
              )
            return res.redirect("/admin/catagory");
        }
        else if(existingcatagoryname){
            req.flash("caterror","category already exist")
            return res.redirect(`/admin/catagoryedit/${id}`)
        } 
          else{
          
            console.log("update aaind");
            await catagoryCollection.updateOne(
                { _id: id },
                { name: data.name, description: data.description,catagoryOffer:data.catagoryOffer }
              );
              return res.redirect("/admin/catagory");

          }
            
        
    } catch (error) {
        console.log(error);
       
        
    }
};




module.exports={
    
    catagoryedit,
    updatecatagory,
}