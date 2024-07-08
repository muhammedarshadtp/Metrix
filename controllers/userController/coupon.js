const couponCollection = require("../../model/coupon-schema")
const userCollection = require("../../model/user-schema")


const ApplyCoupon = async (req, res) => {
    try {
        const { couponCode, subtotal } = req.body
        console.log(req.body, 'req.body kitty');
        req.session.couponCode = couponCode
        const coupon = await couponCollection.findOne({ name: couponCode })
        console.log(coupon, 'coupon data');

        const userId = req.session.userId

        if (coupon && coupon.couponStatus === 'ACTIVE') {
            const user = await userCollection.findOne({ userId: userId })


            if (user && user.usedCoupons.includes(couponCode)) {
                res.json({ success: false, message: "Already Redeemed" })
            } else if (coupon.minimum_cart_price >= subtotal) {
                res.json({error:`maximum cart value need for apply coupon is ${coupon.minimum_cart_price}`})
            } else if (coupon.ending_date > new Date() && coupon.minimum_cart_price <= subtotal) {
                let dicprice = (subtotal * coupon.discount) / 100
                if (dicprice >= coupon.maximum_cart_redeem) {
                    dicprice = coupon.maximum_cart_redeem
                }
                req.session.dicprice=dicprice
                price = subtotal - dicprice;
                req.session.finalprice = price
                console.log(price, 'price kitty');
                res.json({ success: true, dicprice, price });
            } else {
                res.json({ success: false, message: "Invalid Coupon" });
            }
        } else {
            res.json({ success: false, message: "Coupon not found" });
        }


    } catch (error) {
        console.log(error, 'coupon error');
    }
}

const removeCoupon = async (req, res) => {
    try {
        const userId = req.session.userId

        const { couponCode, subtotal } = req.body

        const coupon = await couponCollection.findOne({ name: couponCode })

        const total = Number(subtotal)

        const updatedTotalPrice = total / (1 - coupon.discount /100)
        console.log(updatedTotalPrice,'updatedPrice');
        const price = subtotal + updatedTotalPrice
        res.json({success:true,price})

    } catch (error) {

    }
}

module.exports = {
    ApplyCoupon,
    removeCoupon
}