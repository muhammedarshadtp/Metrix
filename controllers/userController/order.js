const cartCollection = require("../../model/cart-schema")
const orderCollection = require("../../model/order-schema")
const productsCollection = require("../../model/products-schema")
const addressCollection = require("../../model/user-address")
const userCollection = require("../../model/user-schema")
const walletCollection = require("../../model/wallet-schema")
const sendOrderMail = require("../../utils/order-placed-mail")
const otpGeneratorUser = require("../../utils/otp_generator")


const user_orderHistory = async (req, res) => {
    try {
        const userId = req.session.userId
    const user = req.session.isAuth

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const startIndex = (page - 1) * limit;

    const totalOrders = await orderCollection.countDocuments({ userId: userId });

    const order = await orderCollection.find({ userId: userId }).populate("userId").sort({ orderDate: -1 }).skip(startIndex).limit(limit)
    const cart = await cartCollection.find({userId:userId})

    console.log(order, 'order kitty');
    res.render('orderHistory', { order, user, cart,limit,
        currentPage: page, 
        totalPages: Math.ceil(totalOrders / limit)})
    } catch (error) {
        console.log(error,'orderHistory error');
    }
}

const user_addOrder = async (req, res) => {
    try {
        console.log(req.query);
        const { cartId, addressId, paymentMethod } = req.query;
        // if (!cartId || !addressId || !paymentMethod) {
        //     return res.status(400).json({ error: 'Missing required fields' });
        // }

        const address = await addressCollection.findById(addressId);
        console.log(address, 'address');
        // if (!address) {
        //     return res.status(404).json({ error: 'Address not found' });
        // }
        const cartData = await cartCollection.findById(cartId).populate('items.productId').populate('userId','username email')
        cartData.items.map(async (item) => {
            if(!(Number(item.quantity) <= Number(item.productId.stock))){
                console.log('what is happening');
                return res.json({result:'error'})
            }else{
                console.log('inside else');
               await OrderPlace()
            }
        })
        const products = cartData.items.map(item => ({
                productId: item.productId._id,
                status: 'Order Placed',
                name: item.productId.name,
                price: item.price,
                quantity: item.quantity,
                images: item.images,
        
        }));
        let totalPrice 
        if( req.session.finalprice){
            totalPrice =  req.session.finalprice
        }else{
            totalPrice = cartData.Total

        }
        console.log(cartData,'cart data is showing ==================');

        console.log(products, 'product data');

        console.log(paymentMethod, 'payment method is showing');
        async function OrderPlace (){

            const orderId = await otpGeneratorUser()
    
            const orderPlace = await orderCollection.create({
                userId: cartData.userId,
                orderId: orderId,
                products: products,
                totalPrice:totalPrice,
                address: address,
                paymentMethod: paymentMethod,
                
            });
            req.session.ORDER_PLACED = orderPlace
            console.log(orderPlace, 'Order placed');
             for (let product of products) {
                const productDoc = await productsCollection.findById(product.productId);
                if (productDoc && productDoc.stock >= product.quantity) {
                    productDoc.stock -= product.quantity;
                    await productDoc.save();
                }
            }
    
    
            const cartDataDeleting = await cartCollection.findByIdAndDelete(cartData._id)
            
            console.log(cartDataDeleting, 'cart data deleting');
            await sendOrderMail(cartData.userId.email, cartData.userId.username, orderId, products, cartData.Total)
         res.json({ result: "success", order: orderPlace });
        }



    } catch (error) {
        console.error(error, 'error is showing');
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const order_placed = async (req, res) => {
    const user = req.session.isAuth
    const order = req.session.ORDER_PLACED

    res.render('orderPlaced', { order, user,cart:'' })
}


const cancelOrder = async (req, res) => {
    try {

        const userId = req.session.userId
        console.log("entering cancel");
        const { orderId,productId} = req.query

        console.log(productId,"product id kitty");

        const order = await orderCollection.findOne({ orderId: orderId, "products.productId": productId });
        const productItem = order.products.find(item => item.productId.toString() === productId);
       
        const quantity = productItem.quantity;
        const currentStatus =productItem.status


        const cancelledOrderData = await orderCollection.updateOne(
            { 
              orderId: orderId, 
              "products.productId": productId 
            },
            { 
              $set: { "products.$.status": "Order Cancelled" } 
            }
          );
        console.log(cancelledOrderData,'cancel order');
        if (cancelledOrderData.modifiedCount > 0) {
            // Increment the stock quantity for the cancelled product
            const product = await productsCollection.findById(productId);
            if (product) {
                product.stock += quantity;
                await product.save();
            }
        }
      
        if(order.paymentMethod !=='Cash on Delivery' && currentStatus !== 'Order Cancelled'){
            const amount = productItem.price * quantity;
            const  walletTransactions = {
                remarks:'User cancel a order',
                date:new Date(),
                type:'Credit',
                amount:amount,
            }
              console.log('Processing wallet transaction=====================');

            const wallet = await walletCollection.updateOne({userId:userId},{$inc:{wallet:+amount},$addToSet:{walletTransactions:walletTransactions}},{upsert:true})
            console.log(wallet,'sdhbvfsdhb=================================');
        }
        
        res.json({result:"success"})






    } catch (error) {
        console.log(error,'cancelOrder page error');

    }
}

const orderReturn = async (req,res)=>{
    try {
        const {orderId,productId,reason}= req.body

        const order = await orderCollection.findOne({orderId:orderId,'products.productId':productId})

        if(order){
            const product = order.products.find(p => p.productId === productId)
            product.status = 'Return Requested';
            product.returnReason = reason;
             await order.save()
             res.json({ result: 'success' }); 
        }

        res.json({result})
    } catch (error) {
        console.log(error,'return order errror');
    }
}

module.exports = {
    user_orderHistory,
    order_placed,
    user_addOrder,
    cancelOrder,
    orderReturn
}