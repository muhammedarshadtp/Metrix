const orderCollection = require("../../model/order-schema")


const orderDetail = async (req, res) => {
    try {
        const orderId = req.params.id;
        console.log(orderId);
        const orderDetails = await orderCollection.findOne({ orderId: orderId })
            .populate('userId', 'username email')  // Populating user details
            .populate('products.productId', 'name price');  // Populating product details
        console.log(orderDetails, 'order deails is showing');
        res.render('orderDetails', { orderDetails });
    } catch (error) {
        console.error(error);

    }
};


const updateOrderStatus = async (req, res) => {
    try {
        console.log('entering=================');
        console.log(req.body);
        const { status, orderId, productId } = req.body
        const result = await orderCollection.updateOne(
            { orderId: orderId },
            { $set: { "products.$[elem].status": status } },
            { arrayFilters: [{ "elem.productId": productId }] }
        );
        console.log(result, 'resily===========');
        if (result.matchedCount > 0) {
            res.json({ success: true, message: 'Order status updated successfully.',status });
        } else {
            res.status(404).json({ success: false, message: 'Order not found.' });
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    orderDetail,
    updateOrderStatus,
}