const couponCollection = require("../../model/coupon-schema");


const coupon = async(req,res)=>{
    try {
        const limit = 6;
        let page = Number(req.query.page) || 1;

        const TOTAL_COUNT_OF_COUPON = await couponCollection.countDocuments()
        const totalPages = Math.ceil(TOTAL_COUNT_OF_COUPON / limit);

        page = Math.max(1, Math.min(page, totalPages));

        const skip = (page - 1) * limit;


        const coupon = await couponCollection.find().skip(skip).limit(limit)

        res.render('coupon',{coupon,page,totalPages, count:TOTAL_COUNT_OF_COUPON})
    } catch (error) {
        
    }
}

 const couponPost=async(req,res)=>{
    try {
        const coupon = req.body
        console.log(coupon,'data kitty');
        const { name,discount,starting_date,expiry,minimum_cart_price,description } = coupon

        const couponData = {
            name:name,
            discount:Number(discount),
            starting_date:starting_date,
            ending_date:expiry,
            minimum_cart_price:Number(minimum_cart_price),
            description:description,
        }

        const couponValid = await couponCollection.findOne({name:couponData.name})

        if(couponValid){
            res.json({ result: 'already exists'})
        }else{
            const newCoupon = await couponCollection.create(couponData)
            res.json({ result: 'success'})
        }

    } catch (error) {
        console.log(error);
    }
 }


 const updateCoupon = async(req,res)=>{
    try {
        const { couponId, couponStatus } = req.body
        let status
        if(couponStatus=='ACTIVE'){
            status = 'hide'
            await couponCollection.findByIdAndUpdate(couponId,{couponStatus:'ARCHIVED'})
        }else if(couponStatus=='ARCHIVED'){
            status = 'unhide'
            await couponCollection.findByIdAndUpdate(couponId,{couponStatus:'ACTIVE'})
        }
        res.json({ result: 'success',status })
    } catch (error) {
        
    }
 }

    const couponEdit = async(req,res)=>{
        try {
            const { couponId } = req.query
            const coupon = await couponCollection.findById(couponId)
            res.render('couponEdit',{coupon})
        } catch (error) {
            console.log(error);
        }
    }






 const couponEditPut = async(req,res)=>{
    try {
        console.log('entring===============');
        const { couponId } = req.query
        console.log(req.query,'query is showing successfully');
        const formData = req.body
        console.log(req.body,'====================');
        const {
            name, discount, starting_date, expiry, minimum_cart_price, description
        } = formData

        const updatedCouponData = {
            name: name,
            discount: Number(discount),
            starting_date: starting_date,
            ending_date: expiry,
            mininmum_cart_price: Number(minimum_cart_price),
            description: description,
        }
        console.log(updatedCouponData,'coupon Dataa');
        const couponValid = await couponCollection.findOne({name:updatedCouponData.name})
        console.log(couponValid);
        console.log(!couponValid,'not================');
        if(!couponValid || couponValid._id.equals(couponId)){
            console.log('ullil keri');
            const newCoupon = await couponCollection.findByIdAndUpdate(couponId,updatedCouponData)
            res.json({ result: 'success'})
        }else{
            console.log('oombiiiiiiii=============');
            res.json({ result: 'already exists'})
        }
        
    } catch (error) {
        
    }
 }



module.exports={
    coupon,
    couponPost,
    updateCoupon,
    couponEditPut,
    couponEdit,
}