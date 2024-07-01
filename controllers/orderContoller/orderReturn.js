const orderCollection = require("../../model/order-schema");
const productsCollection = require("../../model/products-schema");



const orderReturn = async (req, res) => {
    try {
        const limit = 6;
        let page = Number(req.query.page) || 1;

        const TOTAL_COUNT_OF_ORDERS = await orderCollection.countDocuments({
            $or: [
                { products: { $elemMatch: { status: "Return Requested" } } },
                { products: { $elemMatch: { returnStatus: "APPROVE" } } },
                { products: { $elemMatch: { returnStatus: "REJECTED" } } }
            ]
        })
        const totalPages = Math.ceil(TOTAL_COUNT_OF_ORDERS / limit);
        console.log(TOTAL_COUNT_OF_ORDERS, 'total count is showing');
        page = Math.max(1, Math.min(page, totalPages));
        console.log(page, 'page');


        const skip = (page - 1) * limit;
        const orders = await orderCollection.find({
            $or: [
                { products: { $elemMatch: { status: "Return Requested" } } },
                { products: { $elemMatch: { returnStatus: "APPROVE" } } },
                { products: { $elemMatch: { returnStatus: "REJECTED" } } }
            ]
        }).skip(skip).limit(limit)
        res.render('orderReturn', { orders, page, totalPages, count: TOTAL_COUNT_OF_ORDERS })

    } catch (error) {
        console.log(error, 'error order return ');
    }
}



const orderReturnDetails = async (req, res) => {
    try {
        const { orderId } = req.query
        console.log(orderId, 'order id is showing');
        const orderDetails = await orderCollection.findById(orderId)

        console.log(orderDetails, 'order details is showing');
        res.render('orderReturnDetalis', { orderDetails })


    } catch (error) {
        console.log(error, 'orderReturnDetails error');
    }
}

const orderReturnConformation = async (req, res) => {
    try {
        const { orderId, productId, userId, action, quantity } = req.body

        const orderDetails = await orderCollection.findOne({ orderId: orderId })
        console.log(orderDetails, 'orderDetails kitty');

        const product = await productsCollection.findById(productId).populate('catagory')
        console.log(product, 'product kitty');

        if (action === 'APPROVE') {
            console.log('if keri');
            const result = await orderCollection.findOneAndUpdate({ orderId: orderId },
                { $set: { "products.$[elem].returnStatus": 'APPROVE', "products.$[elem].status": "Returned" } },
                {
                    arrayFilters: [{ "elem.productId": productId }],
                })
                console.log(result,'result kitty');
                let updateProductStock = Number(product.stock) + Number(quantity);

                const data = await productsCollection.findByIdAndUpdate(productId,{stock:updateProductStock})
                console.log(data,'data kitty');

                res.json({ result: 'APPROVE' })
        }else if(action === 'REJECTED'){
            const result = await orderCollection.findOneAndUpdate({ orderId: orderId },
                { $set: { "products.$[elem].returnStatus": 'REJECTED', "products.$[elem].status": "Delivered" } },
                {
                    arrayFilters: [{ "elem.productId": productId }],
                })
                res.json({ result: 'REJECTED' })
        }




    } catch (error) {
        console.log(error,'orderReturnConformation error');
    }
}



module.exports = {
    orderReturn,
    orderReturnDetails,
    orderReturnConformation,
}