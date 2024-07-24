const { validatePassword } = require("../../config/validation");
const cartCollection = require("../../model/cart-schema");
const addressCollection = require("../../model/user-address");
const userCollection = require("../../model/user-schema");
const wishlistCollection = require("../../model/wishlist-schema");
const { alphanumValid,AlphaOnly, zerotonine } = require("../../utils/validation/adminValidation");










const account = async (req,res) => {
    try {
        const user = req.session.isAuth
        const userId = req.session.userId
        const cart = await cartCollection.findOne({userId:userId}).populate("items.productId");
        const wishlist =await wishlistCollection.findOne({userId:userId}).populate("item.productId")
        res.render('account',{user,cart,wishlist})
    } catch (error) {
        console.log(error,'account error');
        res.render('error_page')
    }

    
}

const userAddress=async(req,res)=>{
    try {
        const user = req.session.isAuth
        const userId=req.session.userId
        const userdata= await userCollection.findById(userId)
        const address = await addressCollection.find({userId:userId})
        const cart = await cartCollection.findOne({userId:userId}).populate('items.productId')
        const wishlist = await wishlistCollection.findOne({userId:userId}).populate('item.productId')
        res.render('userAddress',{user,wishlist,userdata,address,cart,
            nameError: req.flash('nameError'),
            countryError: req.flash('countryError'),
            addressError: req.flash('addressError'),
            streetError: req.flash('streetError'),
            cityError: req.flash('cityError'),
            stateError: req.flash('stateError'),
            pincodeError: req.flash('pincodeError'),
            phoneError: req.flash('phoneError'),
        })
    } catch (error) {
        console.log(error);
    }
}

const addAddress = async (req, res) => {
    try {
        const userId = req.session.userId
        const {name,country,address,street,city,state,pincode,phone}=req.body
        console.log(req.body,'++++++++++++++++++++++');
        const nameValid = AlphaOnly(name);
         const countryValid = AlphaOnly(country);
         const addressValid = alphanumValid(address);
         const streetValid = alphanumValid(street);
         const cityValid = AlphaOnly(city);
         const stateValid = AlphaOnly(state);
         const pincodeValid = zerotonine(pincode);
         const phoneValid = zerotonine(phone);
         if (!nameValid) {
            const nameError = 'Name must contain only alphabetic characters.'
            return  res.json({error:`${nameError}`});
        }
         if (!countryValid) {
            const countryError = 'Country must contain only alphabetic characters.'
            return  res.json({error:`${countryError}`});
        }
         if (!addressValid) {
            const addressError = 'Address must contain only alphanumeric characters.'
            return  res.json({error:`${addressError}`});
        }
         if (!streetValid) {
            const streetError = 'Street must contain only alphanumeric characters.'
            return  res.json({error:`${streetError}`});
        }
         if (!cityValid) {
            const cityError = 'City must contain only alphabetic characters.'
            return  res.json({error:`${cityError}`});
        }
        if (!stateValid) {
            const stateError = 'State must contain only alphabetic characters.'
            return  res.json({error:`${stateError}`});
        }
        if (!pincodeValid) {
            const pincodeError = 'Pincode must contain only numeric characters.'
            return  res.json({error:`${pincodeError}`});
        }
        if (!phoneValid) {
            const phoneError = 'Phone must contain only numeric characters.'
            return  res.json({error:`${phoneError}`});
        }
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

         return res.json({result:"success"})

        


    } catch (error) {
        console.log(error, 'checkout post  error');
       
    }

}

const deleteAddress = async (req,res)=>{
   try {
    const {id} = req.query
    const deleteAddress = await addressCollection.findByIdAndDelete(id)
  
    res.json({result:"success"})
   } catch (error) {
    console.log(error);
   }

}

const profile = async(req,res)=>{
    try {
        const user = req.session.isAuth
        const userId = req.session.userId
        const userdata= await userCollection.findById(userId)
        const cart = await cartCollection.findOne({userId:userId}).populate('items.productId')
        const wishlist = await wishlistCollection.findOne({userId:userId}).populate('item.productId')

        res.render('profile',{user,cart,userdata,wishlist,
            nameError:req.flash('nameError')
        })
    } catch (error) {
        console.log(error,'profile error');
    }

}

const changepassword = async(req,res)=>{
    try {
        const user = req.session.isAuth
        const userId = req.session.userId
        const cart = await cartCollection.findOne({userId:userId}).populate('items.productId')
        const wishlist = await wishlistCollection.findOne({userId:userId}).populate('item.productId')
        res.render('changepassword',{user,cart,wishlist});
    } catch (error) {
        console.log(error);
        res.render('error_page')
    }
}

const changePassword = async (req,res)=>{
    try {
        const userId = req.session.userId;
        const { currentPassword, newPassword, conformPassword } = req.body;
        console.log(req.body)
        console.log(currentPassword,newPassword,conformPassword);

        // const validateCurPassword = validatePassword(currentPassword)
        const validatenewPassword = validatePassword(newPassword)
        const validateconformPassword =validatePassword(conformPassword)
        console.log(validatenewPassword,validateconformPassword,'password kitty');

        if(validatenewPassword==false){
            req.flash('error_msg','Please enter a valid new password')
             return res.redirect('/changepassword')
        }
        if(validateconformPassword == false){
            req.flash('error_msg','Please conform your new password correctly')
            return  res.redirect('/changepassword')
        }
    
        const user = await userCollection.findByIdAndUpdate(userId)
        const isMatch =  user.password == currentPassword
        if (!isMatch) {
            req.flash('error_msg', 'Current password is incorrect');
            return res.redirect('/changepassword');
        }
        if (newPassword !== conformPassword) {
            req.flash('error_msg', 'New password and confirm password do not match');
            return res.redirect('/changepassword');
        }
        
    user.password = newPassword;
    await user.save();

   
    res.redirect('/account');

    } catch (error) {
        console.error(error);
        return res.redirect('/error_page')
    }
}


const updateUser=async(req,res)=>{
    try {
        const userId=req.session.userId
        const data={
          username:req.body.name
        }
        console.log(data);
        const nameValid=alphanumValid(data.username)
        if(!nameValid){
            req.flash('nameError','Invalid name format. Name should contain only alphabetic characters.')
            return res.redirect('/profile')
        }

        const userdata = await userCollection.findByIdAndUpdate(userId,data)
        console.log(userdata,'user update ayi');
        res.redirect('/account')
    } catch (error) {
        console.log(error);
        return res.redirect('/error_page')
    }
}



const userAddAddress=async(req,res)=>{
    try {
        const user = req.session.isAuth
        const userId=req.session.userId
        const userdata= await userCollection.findById(userId)
        const cart = await cartCollection.findOne({userId:userId}).populate('items.productId')
        const wishlist = await wishlistCollection.findOne({userId:userId}).populate('item.productId')
        const address = await addressCollection.findOne({userId:userId})
        res.render('userAddAddress',{user,address,cart,wishlist,
            nameError: req.flash('nameError'),
            countryError: req.flash('countryError'),
            addressError: req.flash('addressError'),
            streetError: req.flash('streetError'),
            cityError: req.flash('cityError'),
            stateError: req.flash('stateError'),
            pincodeError: req.flash('pincodeError'),
            phoneError: req.flash('phoneError')
        })
    } catch (error) {
        console.log(error,'user Address error');
        return res.redirect('/error_page')
    }

}

const userAddAddressPost=async(req,res)=>{
    try {
        const userId=req.session.userId
        const {name,country,address,street,city,state,pincode,phone}=req.body
        console.log(req.body,'++++++++++++++++++++++');
         // Validate the inputs
         const nameValid = AlphaOnly(name);
         const countryValid = AlphaOnly(country);
         const addressValid = alphanumValid(address);
         const streetValid = alphanumValid(street);
         const cityValid = AlphaOnly(city);
         const stateValid = AlphaOnly(state);
         const pincodeValid = zerotonine(pincode);
         const phoneValid = zerotonine(phone);
         if (!nameValid) {
            const nameError = 'Name must contain only alphabetic characters.'
            return  res.json({error:`${nameError}`});
        }
         if (!countryValid) {
            const countryError = 'Country must contain only alphabetic characters.'
            return  res.json({error:`${countryError}`});
        }
         if (!addressValid) {
            const addressError = 'Address must contain only alphanumeric characters.'
            return  res.json({error:`${addressError}`});
        }
         if (!streetValid) {
            const streetError = 'Street must contain only alphanumeric characters.'
            return  res.json({error:`${streetError}`});
        }
         if (!cityValid) {
            const cityError = 'City must contain only alphabetic characters.'
            return  res.json({error:`${cityError}`});
        }
        if (!stateValid) {
            const stateError = 'State must contain only alphabetic characters.'
            return  res.json({error:`${stateError}`});
        }
        if (!pincodeValid) {
            const pincodeError = 'Pincode must contain only numeric characters.'
            return  res.json({error:`${pincodeError}`});
        }
        if (!phoneValid) {
            const phoneError = 'Phone must contain only numeric characters.'
            return  res.json({error:`${phoneError}`});
        }
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
         return res.json({result:'success'})
        
    } catch (error) {
        console.log(error,'addAddress error');
        return res.redirect('/error_page')
    }
}


const editAddress = async (req,res)=>{
    try {
        const userId = req.session.userId
        const user = await userCollection.findOne({userId:userId})
        const cart = await cartCollection.findOne({userId:userId}).populate('items.productId')
        const wishlist = await wishlistCollection.findOne({userId:userId}).populate('item.productId')
        const {addressId,path}  = req.query
        console.log(path,'path is showing -=======================================');
        const address = await addressCollection.findById(addressId)
        console.log(address,'address is showing successfully =========');   
        res.render("userAddressEdit",{address,user,cart,path,addressId,wishlist,
            nameError: req.flash('nameError'),
            countryError: req.flash('countryError'),
            addressError: req.flash('addressError'),
            streetError: req.flash('streetError'),
            cityError: req.flash('cityError'),
            stateError: req.flash('stateError'),
            pincodeError: req.flash('pincodeError'),
            phoneError: req.flash('phoneError')
        })
    } catch (error) {
        console.log(error,'error in edit address post page');
        return res.redirect('/error_page')
    }
}

const editAddressPost = async (req,res)=>{
    try {
        const userId = req.session.userId
        const {path,addressId} = req.query
        console.log(path,'================');
        const {name,country,address,street,city,state,pincode,phone}=req.body
        console.log(req.body,'req.body is showing')
          // Validate the inputs
          const nameValid = AlphaOnly(name);
          const countryValid = AlphaOnly(country);
          const addressValid = alphanumValid(address);
          const streetValid = alphanumValid(street);
          const cityValid = AlphaOnly(city);
          const stateValid = AlphaOnly(state);
          const pincodeValid = zerotonine(pincode);
          const phoneValid = zerotonine(phone);
  
          if (!nameValid) {
            const nameError = 'Name must contain only alphabetic characters.'
            console.log('myr work ayal mathi');
            return  res.json({error:`${nameError}`});
        }
         if (!countryValid) {
          const countryError= 'Country must contain only alphabetic characters.';
            return  res.json({error:`${countryError}`});
        }
        if (!addressValid) {
            const addressError = 'Address must contain only alphanumeric characters.';
            return  res.json({error:`${addressError}`});
        }
        if (!streetValid) {
            const streetError = 'Street must contain only alphanumeric characters.';
            return  res.json({error:`${streetError}`});
        }
        if (!cityValid) {
            const cityError= 'City must contain only alphabetic characters.';
            return  res.json({error:`${cityError}`});
        }
        if (!stateValid) {
           const stateError = 'State must contain only alphabetic characters.';
            return  res.json({error:`${stateError}`});
        }
        if (!pincodeValid) {
           const pincodeError = 'Pincode must contain only numeric characters.';
            return  res.json({error:`${pincodeError}`});
        }
        if (!phoneValid) {
           const phoneError = 'Phone must contain only numeric characters.';
            return  res.json({error:`${phoneError}`});
        }

        const addressData = {
            name:name,
            country:country,
            address:address,
            street:street,
            city:city,
            state:state,
            pincode:pincode,
            phone:phone,

        }
        const updateAddress = await addressCollection.updateOne({userId:userId},{$set:addressData})
        console.log(updateAddress,'succesor not is showing ================='); 
        res.json({result:'success',path})
    } catch (error) {
        console.log(error,'edit address post error');
        return res.redirect('/error_page')
    }
}

module.exports={
    account,
    addAddress,
    deleteAddress,
    profile,
    updateUser,
    userAddress,
    userAddAddress,
    userAddAddressPost,
    editAddress,
    editAddressPost,
    changePassword,
    changepassword
        

}