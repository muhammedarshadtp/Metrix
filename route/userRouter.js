const express=require("express")
const router = express.Router();

const userController=require('../controllers/userController/userLogin');
const userHome= require('../controllers/userController/userHome')
const userSignin = require('../controllers/userController/userSignin')
const userProducts=require('../controllers/userController/userProducts')
const userCart=require('../controllers/userController/userCart')
const errorpage=require('../controllers/userController/errorPage')
const google=require('../controllers/userController/googleAuth')
const logout=require('../controllers/userController/userLogout')
const forRe = require('../controllers/userController/userForgotpassword')
const checkout=require('../controllers/userController/checkout')
const otp=require('../controllers/userController/userOtp')
const {user_auth,status} = require("../middleware/userAuth");

const {whishlistcart}= require('../utils/validationNavbar');
const { user_orderHistory,order_placed, user_addOrder,cancelOrder } = require("../controllers/userController/order");
const  account  = require("../controllers/userController/accounts");

router.use(whishlistcart)

router.get('/',userHome.home)


router.get('/signup',userSignin.signup)

router.post('/signup',userSignin.signupPost)

router.get('/login',userController.login)

router.post('/login',userController.loginpost)

router.get('/otpverification',otp.otpverification)

router.post('/otpverification',otp.otpverificationpost)

router.get('/user_forgotpassword',forRe.user_forgotpassword)

router.get('/resend_otp',otp.resend_otp)

router.post('/user_forgotpasswordPost',forRe.user_forgotpasswordPost)

router.get('/resetPassword',forRe.resetPassword)

router.post('/resetPasswordPost',forRe.resetPasswordPost)

router.get('/account',user_auth,account.account)

router.get('/profile',user_auth,account.profile)

router.post('/updateUser',user_auth,account.updateUser)

router.get('/userAddress',user_auth,account.userAddress)

router.post('/addAddress',user_auth,account.addAddress)

router.get('/editAddress',user_auth,account.editAddress)

router.post('/editAddress',user_auth,account.editAddressPost)

router.get('/userAddAddress',user_auth,account.userAddAddress)

router.post('/userAddAddressPost',user_auth,account.userAddAddressPost)

router.get('/deleteAddress',user_auth,account.deleteAddress)

router.get('/products',userProducts.products)

router.get('/productDetail/:id',userProducts.productDetail)

router.get('/cartpage',user_auth,userCart.showcart)

router.get('/cart',user_auth,userCart.cart)

router.get('/deletecart/:id',user_auth, userCart.deletecart)

router.post('/update-cart-quantity/:productId/',user_auth,userCart.updatecart)

router.get('/checkout',user_auth,checkout.checkout)

router.get('/orderPlaced',user_auth,order_placed)

router.get('/ordersHistory',user_auth,user_orderHistory)

router.get('/addOrder',user_auth,user_addOrder)

router.get('/cancelOrder',user_auth,cancelOrder)

router.get('/logout',logout.logout)

router.get('/success',google.google)

router.get('/error_page',errorpage.error_page)



















module.exports=router