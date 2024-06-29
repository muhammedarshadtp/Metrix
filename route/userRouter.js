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

// const {whishlistcart}= require('../utils/validationNavbar');
const { user_orderHistory,order_placed, user_addOrder,cancelOrder } = require("../controllers/userController/order");
const  account  = require("../controllers/userController/accounts");
const { razorpay } = require("../controllers/userController/razorpay");
const { wishlist,addToWishlist,Removewishlist } = require("../controllers/userController/wishlist");
const { ApplyCoupon,removeCoupon } = require("../controllers/userController/coupon");

// router.use(whishlistcart)

router.get('/',userHome.home)

// ------Singin---------//

router.get('/signup',userSignin.signup)

router.post('/signup',userSignin.signupPost)

// ----------Login-----------//

router.get('/login',userController.login)

router.post('/login',userController.loginpost)

// -----------Otp-------------//

router.get('/otpverification',otp.otpverification)

router.post('/otpverification',otp.otpverificationpost)

// ---------------forgotPassword----------//

router.get('/user_forgotpassword',forRe.user_forgotpassword)

router.get('/resend_otp',otp.resend_otp)

router.post('/user_forgotpasswordPost',forRe.user_forgotpasswordPost)

// ----------resetPasseword-------------//

router.get('/resetPassword',forRe.resetPassword)

router.post('/resetPasswordPost',forRe.resetPasswordPost)

// ----------account---------------//

router.get('/account',user_auth,account.account)

router.get('/profile',user_auth,account.profile)

router.post('/updateUser',user_auth,account.updateUser)

router.post('/changepassword',user_auth,account.changePassword)

router.get('/changepassword',user_auth,account.changepassword)

router.get('/userAddress',user_auth,account.userAddress)

router.post('/addAddress',user_auth,account.addAddress)

router.get('/editAddress',user_auth,account.editAddress)

router.post('/editAddress',user_auth,account.editAddressPost)

router.get('/userAddAddress',user_auth,account.userAddAddress)

router.post('/userAddAddressPost',user_auth,account.userAddAddressPost)

router.get('/deleteAddress',user_auth,account.deleteAddress)

// --------------Products---------------//

router.get('/products',userProducts.products)

router.get('/productDetail/:id',userProducts.productDetail)

// --------------Cart------------------------//

router.get('/cartpage',user_auth,userCart.showcart)

router.get('/cart',user_auth,userCart.cart)

router.get('/deletecart/:id',user_auth, userCart.deletecart)

router.post('/update-cart-quantity/:productId/',user_auth,userCart.updatecart)

// -------------Checkout-----------------//

router.get('/checkout',user_auth,checkout.checkout)

router.get('/orderPlaced',user_auth,order_placed)

router.get('/ordersHistory',user_auth,user_orderHistory)

router.get('/addOrder',user_auth,user_addOrder)

router.get('/cancelOrder',user_auth,cancelOrder)

// ------------Wishlist----------------//

router.get('/wishlist',user_auth,wishlist)

router.post('/addToWishlist',user_auth,addToWishlist)

router.post('/Removewishlist',user_auth,Removewishlist)

// ------------------coupon--------------------//

router.post('/ApplyCoupon',user_auth,ApplyCoupon)

// router.post('/removeCoupon',user_auth,removeCoupon)


// ---------------Wallet------------------//






// ------------logout-------------//

router.get('/logout',logout.logout)

// ----------------google success ---------------//

router.get('/success',google.google)

// ----------------error-page--------------------//

router.get('/error_page',errorpage.error_page)

// --------------razorpay-----------//

router.get('/razorpay',razorpay)



















module.exports=router