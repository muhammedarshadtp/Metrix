const express=require("express")
const router = express.Router();

const userController=require('../controllers/userController/publicview');
const {user_auth,status} = require("../middleware/userAuth");

router.get('/',userController.home)


router.get('/signup',userController.signup)

router.post('/signup',userController.signupPost)

router.get('/login',userController.login)

router.post('/login',userController.loginpost)

router.get('/otpverification',userController.otpverification)

router.post('/otpverification',userController.otpverificationpost)

router.get('/user_forgotpassword',userController.user_forgotpassword)

router.post('/user_forgotpasswordPost',userController.user_forgotpasswordPost)

router.get('/resetPassword',status,userController.resetPassword)

router.post('/resetPasswordPost',status,userController.resetPasswordPost)

router.get('/resend_otp',userController.resend_otp)

router.get('/account',userController.account)

router.get('/products', status,userController.products)

router.get('/logout',status,userController.logout)

router.get('/success',userController.google)



















module.exports=router