const mongoose = require('mongoose')
const wishlistCollection = require("../../model/wishlist-schema");


const wishlist = async (req,res)=>{
    try {
        const user = req.session.isAuth
        const wishlist = await wishlistCollection.findOne({ userId:req.session.userId }).populate('item.productId')
        console.log(wishlist,"wishlist kitty");



        res.render('wishlist',{wishlist,user})
    } catch (error) {
        console.log(error,"wishlish page error");
        res.render('error_page')
    }
}

const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        console.log(productId);
        const duplicate = await wishlistCollection.findOne({userId:req.session.userId,"item.productId":productId})
        if(duplicate){
          res.json({result:'failure'})
        }else{
                    
            let wishlist = await wishlistCollection.findOneAndUpdate({ userId: req.session.userId},
                {$addToSet:{item:{
                    productId:productId
            }}},
            {upsert:true}
            );
            console.log(wishlist);
            
    
            res.json({result:'success'})

        }
    } catch (error) {
        console.error('Add to wishlist error:', error);
       
    }
};


const Removewishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        let wishlist = await wishlistCollection.findOne({ userId: req.session.userId });

        wishlist.item = wishlist.item.filter(item => item.productId.toString() !== productId);
        await wishlist.save();

        res.redirect('/wishlist');
    } catch (error) {
        console.error('Remove from wishlist error:', error);
        
    }
};



module.exports={
    wishlist,
    addToWishlist,
    Removewishlist

}