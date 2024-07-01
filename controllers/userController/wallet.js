const cartCollection = require("../../model/cart-schema");
const walletCollection = require("../../model/wallet-schema")



const wallet = async (req,res)=>{
    try {
        const userId = req.session.userId
        

        const user = req.session.isAuth
        

        const cart = await cartCollection.find({userId:userId})
       

        const wallet = await walletCollection.findOne({userId:userId})


        res.render('wallet',{wallet,user,cart})

    } catch (error) {
        
    }
}


    const walletPost = async(req,res)=>{
        try {
            const userId = req.session.userId

            const walletAmount = Number(req.body.walletAmount)
            const finalPrice = Number(req.session.finalPrice ||req.body.finalPrice)

            if(walletAmount >= finalPrice){
                const walletTransactions = {
                    remarks:'User purchased a Product',
                    date:new Date(),
                    type:'Debit',
                    amount:finalPrice,
                }
                const wallet = await walletCollection.updateOne({userId:userId},{$inc:{wallet:-amount},$addToSet:{walletTransactions:walletTransactions}},{upsert:true})
                console.log(wallet,'wallet');
                res.json({result:'Within Limit'})
            }else{
                res.json({result:'Limit Exceeded'})
            }
        } catch (error) {
            console.log(error,'wallet error coming');
        }
    }


module.exports ={
    wallet,
    walletPost
}