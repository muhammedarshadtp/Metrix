const userCollection = require("../../model/user-schema");
const { validateEmail, validatePassword, validateName } = require("../../config/validation")
const sendMail = require("../../utils/otp_nodemailer")
const otpGenerator = require('../../utils/otp_generator')




const signup = async (req, res) => {
    res.render('user_signup',{
        existingError:req.flash('existingError'),
        userError:req.flash('userError'),
        emailError:req.flash('emailError'),
        passError:req.flash('passError')

    })
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
            const existingError = 'User with this email already exists'
            return  res.json({error:`${existingError}`});
        }
        if (!validateName(data.username)) {
           const userError = 'Username must contain capital letter and small letters, at least 6 characters';
           return  res.json({error:`${userError}`});
        } else if (!validateEmail(data.email)) {
           const emailError = 'Invalid email address. Please enter a valid format (e.g., user@example.com).';
           return  res.json({error:`${emailError}`});
        } else if (!validatePassword(data.password)) {
           const passError = 'Invalid password. It must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one digit.';
           return  res.json({error:`${passError}`});
        }

        const otp = await otpGenerator()
        req.session.newUserOtp = otp
        req.session.time = new Date()
        console.log(`create signin otp:${otp}`)
        sendMail(data.email, data.username, otp)
        req.session.errorMsg = null; 

        return res.json({result:"success"})
    } catch (error) {
        console.log(error);
        
    }
}


module.exports={
    signup,
    signupPost,
} 