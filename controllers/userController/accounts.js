const addressCollection = require("../../model/user-address");









const account = async (req,res) => {
    res.render('account')
}

const addAddress = async (req, res) => {
    try {
        const userId = req.session.userId
        const {name,country,address,street,city,state,pincode,phone}=req.body
        console.log(req.body,'++++++++++++++++++++++');
        const addressData = {
            name:name,
            userId:userId,
            country:country,
            address:address,
            street:street,
            city:city,
            state:state,
            pincode:pincode,
            phone:phone,

        }
        console.log(addressData,'=======================');
        const addAddress= await addressCollection.create(addressData)
        console.log(addAddress,"addAddress varuninde");

        res.json({result:"success"})

        


    } catch (error) {
        console.log(error, 'checkout post  error');
        return res.render('error_page')
    }

}

const deleteAddress = async (req,res)=>{
   try {
    const {id} = req.query
    const deleteAddress = await addressCollection.findByIdAndDelete(id)
    console.log(deleteAddress,'okkkkkkkkkkkkkkkkkkkkkkk');
    res.json({result:"success"})
   } catch (error) {
    console.log(error);
   }

}

module.exports={
    account,
    addAddress,
    deleteAddress,

}