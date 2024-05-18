
const { validateEmail, validatePassword, validateName } = require("../../config/validation")
const productsCollection = require("../../model/products-schema")
const userCollection = require("../../model/user-schema")
const otpGenerator = require('../../utils/otp_generator')
const sendMail = require("../../utils/otp_nodemailer")





const home = async (req, res) => {
    try {
        const products = await productsCollection.find({status:true})
    const user = req.session.isAuth
    const id = req.session.userid
    const userDetail = await userCollection.find({_id:id})
    console.log(userDetail[0]?.status);
    console.log(id)
    if( userDetail[0]?.status===true){
        
        return res.render('user_home', { products,user })
    }else{
        req.session.isAuth=false
        return res.redirect('/login')

    }
    
    } catch (error) {
        console.log(error);
    }
}


const signup = async (req, res) => {
    res.render('user_signup', { errorMsg: false })
}




const signupPost = async (req, res) => {
    try {
        const data = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };
        console.log(data);
        req.session.userdata = data

        const existingUser = await userCollection.findOne({ email: data.email });
        if (existingUser) {
            return res.render('user_signup', { errorMsg: "User with this email already exists" });
        }
        if (!validateName(data.username)) {
            return res.render('user_signup', { errorMsg: "Invalid username format" });
        } else if (!validateEmail(data.email)) {
            return res.render('user_signup', { errorMsg: "Invalid email format" });
        } else if (!validatePassword(data.password)) {
            return res.render('user_signup', { errorMsg: "Invalid password format" });
        }

        const otp = await otpGenerator()
        req.session.newUserOtp = otp
        console.log(`create signin otp:${otp}`)
        sendMail(data.email, data.username, otp)

        res.redirect('/otpverification');
    } catch (error) {
        console.log(error);
    }
}



const login = async (req, res) => {
    const errorMsg = req.session.errorMsg
    if(req.session.isAuth==false){
        res.render('user_login', { errorMsg })
    }else{
        res.redirect('/')
    }
  
}

const loginpost = async (req, res) => {

    try {
        const data = {
            email: req.body.email,
            password: req.body.password
        };
        console.log(data)
        const emailcollect = await userCollection.findOne({ email: req.body.email })
        console.log(emailcollect);
        console.log(emailcollect._id.toString());
        if (emailcollect.password == req.body.password) {
            req.session.isAuth = true
            req.session.userid=emailcollect._id.toString()
            res.redirect('/')
        } else {
            req.session.errorMsg = "invalid user entry"
            res.redirect('/login')
        }



    } catch (error) {
        console.log(error);
    }
}








const otpverification = async (req, res) => {

    console.log(req.session.userdata);

    // const { email } = req.session.userdata.email
    res.render('user_otpverification')
}



const otpverificationpost = async (req, res) => {
    try {
        const otp = req.body.otp
        console.log(otp)
        const forgotOtp=req.session.forgotOtp
        const oldOtp = req.session.newUserOtp
        console.log(oldOtp)
        console.log(forgotOtp);

        if (otp === oldOtp) {
            const userdata = req.session.userdata
            const value = await userCollection.create([userdata])
            req.session.isAuth = true
            console.log(value)
            res.redirect('/')
        } else if(otp===forgotOtp) {

            
            res.redirect('/resetPassword')

           
        }else{
            res.redirect('/otpverification')
        }
    } catch (error) {
        console.log(error, "user otp verification post");
    }
}




const resend_otp = async (req, res) => {

    try {
        const data = req.session.userdata
        const otp = await otpGenerator()
        sendMail(data.email, data.username, otp)
        req.session.newUserOtp = otp
        req.session.forgotOtp = otp
        console.log(otp);
        res.redirect('/otpverification')
    } catch (error) {
        console.log(error, "resend otp get");

    }
}


const account = async (req, res) => {
    res.redirect('/signup')
}


const products = async (req, res) => {
   try {
    const product = await productsCollection.find({status:true}).populate("catagory")
    const products = product.filter(product=>product.catagory.status===true)
    console.log(products,'products filtered is success');
    res.render('products',{data:products})
   } catch (error) {
    
   }
    
}


const productDetail = async (req, res) => {
    try {
        const productData = req.params.id
     const productDetail = await productsCollection.findOne({_id:productData}).populate("catagory")
     console.log(productDetail,'---------------------------data is founded...');
     res.render('productDetail',{data:productDetail})
    } catch (error) {
     
    }
     
 }


const user_forgotpassword=async(req,res)=>{
    try {


        res.render('user_forgotpassword')  
    } catch (error) {
        
    }
   
}

const user_forgotpasswordPost = async(req,res)=>{
    try {
        const userdata ={
            email:req.body.email
        }
        console.log(userdata);
        req.session.EMAIL_DATA=userdata.email
        console.log(userdata.email);
    
        const userExisting= await userCollection.findOne({email: userdata.email})
        req.session.userdata = userExisting
        if(userExisting){
            const otp = await otpGenerator()
            req.session.forgotOtp = otp
            console.log(`create signin otp:${otp}`)
            sendMail(userExisting.email, userExisting.username, otp)
            return res.redirect('/otpverification')
        }
    } catch (error) {
        console.log(error);
    }

}

const resetPassword=async(req,res)=>{
   try {
    res.render('resetPassword')
   } catch (error) {
    console.log(error);
   }
}

const resetPasswordPost=async(req,res)=>{
    try {
        
        const newPassword=req.body.password
        console.log(newPassword);

        const userdata = req.session.userdata 
        
        const emailFind= await userCollection.findOne({email:userdata.email})
       
        console.log(emailFind);
        const updatePassword= await userCollection.updateOne({email:emailFind.email},{$set:{password:newPassword}})
        console.log(updatePassword);
        res.redirect('/login')

    } catch (error) {
        console.log(error);
    }

}


const logout = async (req, res) => {
    req.session.isAuth=false
    res.redirect('/')
}

const google=async(req,res)=>{
    console.log(userProfile);
    req.session.userid=userProfile._id

}

const cart = async(req,res)=>{
    res.render('cart')
}






module.exports = {
    home,
    signup,
    login,
    signupPost,
    loginpost,
    otpverification,
    user_forgotpassword,
    user_forgotpasswordPost,
    otpverificationpost,
    resend_otp,
    account,
    products,
    resetPassword,
    resetPasswordPost,
    logout,
    google,
    cart,
    productDetail,

}