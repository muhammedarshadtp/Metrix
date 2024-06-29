const orderCollection = require("../../model/order-schema")


const order = async(req,res)=>{

    try {
        const limit = 6
        let page = Number (req.query.page) || 1;

        const  TOTAL_COUNT_OF_ORDER = await orderCollection.countDocuments()
        const totalPages = Math.ceil(TOTAL_COUNT_OF_ORDER/limit)
        page = Math.max(1,Math.min(page,totalPages));

        const skip = (page - 1) * limit;
        
        const orderlist = await orderCollection.find().skip(skip).limit(limit).populate('userId').populate('products');
        res.render('order',{orderlist,page,totalPages,count: TOTAL_COUNT_OF_ORDER})
    } catch (error) {
        console.log(error,'admin eroor coming')

    }


  
}



module.exports={
    order,
}