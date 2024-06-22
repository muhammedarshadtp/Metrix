const orderCollection = require("../../model/order-schema")


const orderDetail = async (req, res) => {
    try {
        const orderId = req.params.id;
        console.log(orderId);
        const orderDetails = await orderCollection.findOne({orderId:orderId})
            .populate('userId', 'username email')  // Populating user details
            .populate('products.productId', 'name price');  // Populating product details
        console.log(orderDetails,'order deails is showing');
        res.render('orderDetails', { orderDetails });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};


module.exports={
    orderDetail,
}