const cartCollection = require("../../model/cart-schema");
const walletCollection = require("../../model/wallet-schema");
const wishlistCollection = require("../../model/wishlist-schema");



const wallet = async (req,res)=>{
    try {
        const userId = req.session.userId
        

        const user = req.session.isAuth
        

        const cart = await cartCollection.find({userId:userId}).populate("items.productId")
       
        const wishlist =await wishlistCollection.findOne({userId:userId}).populate("item.productId")

        const wallet = await walletCollection.findOne({userId:userId})

        wallet.walletTransactions.reverse()

       


        res.render('wallet',{wallet,user,cart,wishlist})

    } catch (error) {
        console.log(error,'----------------');
        return res.redirect('/error_page')
    }
}


    const walletPost = async(req,res)=>{
        try {
            const userId = req.session.userId
            const cart = await cartCollection.find({userId:userId})
            console.log(cart,'kkkkkkk============');

            const cartdata = cart[0].Total
            console.log(cartdata,'-===============');
            const walletAmount = Number(req.body.walletAmount)
            const finalPrice = Number(req.session.finalPrice ||req.body.finalPrice)
            console.log(finalPrice,'============');
            console.log(walletAmount,'============');
            if(walletAmount >= cartdata){
                const walletTransactions = {
                    remarks:'User purchased a Product',
                    date:new Date(),
                    type:'Debit',
                    amount:cartdata,
                }
                
                const wallet = await walletCollection.updateOne({userId:userId},{$inc:{wallet:-cartdata},$addToSet:{walletTransactions:walletTransactions}})
                console.log(wallet,'wallet==========');
                res.json({result:'Within Limit'})
            }else{
                res.json({result:'Limit Exceeded'})
            }
        } catch (error) {
            console.log(error,'wallet error coming');
            return res.redirect('/error_page')
        }
    }


    

module.exports ={
    wallet,
    walletPost
}