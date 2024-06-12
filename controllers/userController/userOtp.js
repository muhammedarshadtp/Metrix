const userCollection = require("../../model/user-schema");
const otpGenerator = require('../../utils/otp_generator')
const sendMail = require("../../utils/otp_nodemailer")




const otpverification = async (req, res) => {

    console.log(req.session.userdata);

    // const { email } = req.session.userdata.email
    res.render('user_otpverification',{

        otpexp: req.flash('otpexp'),
        errorOtp: req.flash('errorOtp'),
    })
}


const otpverificationpost = async (req, res) => {
    try {
        console.log('OTP verification -----');
        const otp = req.body.otp;
        console.log(otp);
        const forgotOtp = req.session.forgotOtp;
        const oldOtp = req.session.newUserOtp;
        console.log(oldOtp);
        console.log(forgotOtp);

        const currentDate = new Date();
        const differenceInSeconds = (currentDate - new Date(req.session.time)) / 1000; // Ensure req.session.time is converted to Date object
        console.log(differenceInSeconds);
        const differenceInSecondsForgot = (currentDate - new Date(req.session.forgotTime)) / 1000;
        

        if (otp === oldOtp) {
            console.log('1');
            if (differenceInSeconds <= 30) { // Check if the difference is 30 seconds or less
                console.log('2');
                const userdata = req.session.userdata;
                console.log(userdata,'userdata kitty');
                const value = await userCollection.create(userdata);

                req.session.userId = value._id
                req.session.isAuth = true;
                console.log(value,'valueeeeeeeee');
                res.redirect('/');
            } else {
                console.log('OTP expired');
                req.flash('otpexp','Otp Expired');
                res.redirect('/otpverification');
            }
        } else if (otp === forgotOtp) {
            console.log('Entered in else if');
            if (differenceInSecondsForgot <= 30) { // Ensure OTP is within valid time for forgot password as well
                res.redirect('/resetPassword');
            } else {
                console.log('OTP expired');
                req.flash('otpexp','Otp Expired');
                res.redirect('/otpverification');
            }
        } else {
            console.log('Invalid OTP');
            req.flash('errorOtp','Wrong otp');
            res.redirect('/otpverification');
        }
    } catch (error) {
        console.log(error, "user otp verification post");
       return res.render('error_page')
    }
};


const resend_otp = async (req, res) => {

    try {
        const data = req.session.userdata
        const otp = await otpGenerator()
        req.session.time = new Date();
        sendMail(data.email, data.username, otp)
        req.session.newUserOtp = otp
        req.session.forgotOtp = otp
        req.session.forgotTime = new Date();
        console.log(otp);
        res.redirect('/otpverification')
    } catch (error) {
        console.log(error, "resend otp get");
        return res.render('error_page')

    }
}

module.exports={
    resend_otp,
    otpverificationpost,
    otpverification


}