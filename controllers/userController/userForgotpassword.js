const userCollection = require("../../model/user-schema");
const otpGenerator = require('../../utils/otp_generator')
const sendMail = require("../../utils/otp_nodemailer")








const user_forgotpassword = async (req, res) => {
    try {


        res.render('user_forgotpassword')
    } catch (error) {

    }

}

const user_forgotpasswordPost = async (req, res) => {
    try {
        const userdata = {
            email: req.body.email
        }
        console.log(userdata);
        req.session.EMAIL_DATA = userdata.email
        console.log(userdata.email);

        const userExisting = await userCollection.findOne({ email: userdata.email })
        req.session.userdata = userExisting
        if (userExisting) {
            const otp = await otpGenerator()
            req.session.forgotOtp = otp
            req.session.forgotTime = new Date()
            console.log(`create signin otp:${otp}`)
            sendMail(userExisting.email, userExisting.username, otp)
            return res.redirect('/otpverification')
        }
    } catch (error) {
        console.log(error);
    }

}



const resetPassword = async (req, res) => {
    try {
        res.render('resetPassword')
    } catch (error) {
        console.log(error);
    }
}

const resetPasswordPost = async (req, res) => {
    try {

        const newPassword = req.body.password
        console.log(newPassword);

        const userdata = req.session.userdata

        const emailFind = await userCollection.findOne({ email: userdata.email })

        console.log(emailFind);
        const updatePassword = await userCollection.updateOne({ email: emailFind.email }, { $set: { password: newPassword } })
        console.log(updatePassword);
        res.redirect('/login')

    } catch (error) {
        console.log(error);
    }

}

module.exports={
    resetPasswordPost,
    resetPassword,
    user_forgotpasswordPost,
    user_forgotpassword,

}