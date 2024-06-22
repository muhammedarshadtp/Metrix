const orderCollection = require("../../model/order-schema")


const order = async(req,res)=>{

    try {
        const orderlist = await orderCollection.find().populate('userId').populate('products');
        console.log(orderlist,"userlist kitty");
        res.render('order',{orderlist})
    } catch (error) {
        
    }


  
}



module.exports={
    order,
}