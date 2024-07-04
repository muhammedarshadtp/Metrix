const { validatePassword } = require("../../config/validation");
const cartCollection = require("../../model/cart-schema");
const addressCollection = require("../../model/user-address");
const userCollection = require("../../model/user-schema");
const { alphanumValid,AlphaOnly, zerotonine } = require("../../utils/validation/adminValidation");










const account = async (req,res) => {
    try {
        const user = req.session.isAuth
        const cart = await cartCollection.find()
        res.render('account',{user,cart})
    } catch (error) {
        console.log(error,'account error');
        res.render('error_page')
    }

    
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
        const cart = await cartCollection.findOne({userId:userId})

        res.render('profile',{user,cart,userdata,
            nameError:req.flash('nameError')
        })
    } catch (error) {
        console.log(error,'profile error');
    }

}

const changepassword = async(req,res)=>{
    try {
        const user = req.session.isAuth
        const cart = await cartCollection.find()
        res.render('changepassword',{user,cart});
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
        res.redirect('/changepassword');
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
    }
}

const userAddress=async(req,res)=>{
    try {
        const user = req.session.isAuth
        const userId=req.session.userId
        const userdata= await userCollection.findById(userId)
        const address = await addressCollection.find({userId:userId})
        const cart = await cartCollection.find()
        res.render('userAddress',{user,userdata,address,cart})
    } catch (error) {
        
    }
}

const userAddAddress=async(req,res)=>{
    try {
        const user = req.session.isAuth
        const userId=req.session.userId
        const userdata= await userCollection.findById(userId)
        const address = await addressCollection.findOne({userId:userId})
        res.render('userAddAddress',{user,address,
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
            req.flash('nameError', 'Name must contain only alphabetic characters.');
            return res.redirect('/editAddress');
        }
         if (!countryValid) {
            req.flash('countryError', 'Country must contain only alphabetic characters.');
            return res.redirect('/editAddress');
        }
         if (!addressValid) {
            req.flash('addressError', 'Address must contain only alphanumeric characters.');
            return res.redirect('/editAddress');
        }
         if (!streetValid) {
            req.flash('streetError', 'Street must contain only alphanumeric characters.');
            return res.redirect('/editAddress');
        }
         if (!cityValid) {
            req.flash('cityError', 'City must contain only alphabetic characters.');
            return res.redirect('/editAddress');
        }
        if (!stateValid) {
            req.flash('stateError', 'State must contain only alphabetic characters.');
            return res.redirect('/editAddress');
        }
        if (!pincodeValid) {
            req.flash('pincodeError', 'Pincode must contain only numeric characters.');
            return res.redirect('/editAddress');
        }
        if (!phoneValid) {
            req.flash('phoneError', 'Phone must contain only numeric characters.');
            return res.redirect('/editAddress');
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
        res.redirect('/account')
        
    } catch (error) {
        console.log(error,'addAddress error');
    }
}


const editAddress = async (req,res)=>{
    try {
        const user = req.session.userId
        
        const cart = await cartCollection.findOne({userId:user})
        const {addressId,path}  = req.query
        console.log(path,'path is showing -=======================================');
        const address = await addressCollection.findById(addressId)
        console.log(address,'address is showing successfully =========');   
        res.render("userAddressEdit",{address,user,cart,path,addressId,
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
            req.flash('nameError', 'Name must contain only alphabetic characters.');
            return res.redirect(`/editAddress?addressId=${addressId}&path=${path}`);
        }
         if (!countryValid) {
            req.flash('countryError', 'Country must contain only alphabetic characters.');
            return res.redirect(`/editAddress?addressId=${addressId}&path=${path}`);
        }
        if (!addressValid) {
            req.flash('addressError', 'Address must contain only alphanumeric characters.');
            return res.redirect(`/editAddress?addressId=${addressId}&path=${path}`);
        }
        if (!streetValid) {
            req.flash('streetError', 'Street must contain only alphanumeric characters.');
            return res.redirect(`/editAddress?addressId=${addressId}&path=${path}`);
        }
        if (!cityValid) {
            req.flash('cityError', 'City must contain only alphabetic characters.');
            return res.redirect(`/editAddress?addressId=${addressId}&path=${path}`);
        }
        if (!stateValid) {
            req.flash('stateError', 'State must contain only alphabetic characters.');
            return res.redirect(`/editAddress?addressId=${addressId}&path=${path}`);
        }
        if (!pincodeValid) {
            req.flash('pincodeError', 'Pincode must contain only numeric characters.');
            return res.redirect(`/editAddress?addressId=${addressId}&path=${path}`);
        }
        if (!phoneValid) {
            req.flash('phoneError', 'Phone must contain only numeric characters.');
            return res.redirect(`/editAddress?addressId=${addressId}&path=${path}`);
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