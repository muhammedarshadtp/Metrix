const catagoryCollection = require("../../model/catagory-schema")
const productsCollection = require("../../model/products-schema")


const productsedit = async(req,res)=>{
   try {
    const productId=req.query.id
    const productsdata= await productsCollection.findById(productId)
    const catagorydata=await catagoryCollection.find()
    res.render('productsedit',{productsdata:productsdata,catagorydata:catagorydata})
   } catch (error) {
    console.log(error);
   }
}

const productseditPost = async(req,res)=>{
    try {
        console.log(req.body.old_images);
     const productstext = await productsCollection.find({_id:req.query.podsId})
     const catagory = await catagoryCollection.findOne({name:req.body.catagory})
     console.log(req.files,"-----------");
     if(req.body.old_images){

         const productseditdatas= await productsCollection.updateOne({_id:req.query.podsId},{$set:{name:req.body.name,catagory:catagory,description:req.body.description, stock:req.body.stock, price:req.body.price,images:req.body.old_images}})
         console.log(productseditdatas);
     }else{
        const productseditdatas= await productsCollection.updateOne({_id:req.query.podsId},{$set:{name:req.body.name,catagory:req.body.catagory,description:req.body.description, stock:req.body.stock, price:req.body.price}})
     }
        
      
        res.redirect('/admin/products')
    } catch (error) {
        console.log(error);
    }
}



module.exports={
    productsedit,
    productseditPost,
    
}