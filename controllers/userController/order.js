

const user_orderHistory = async(req,res)=>{
    res.render('order_history')
}

const order_placed= async(req,res)=>{
    res.render('order_placed')
}


module.exports = {
    user_orderHistory,
    order_placed
}