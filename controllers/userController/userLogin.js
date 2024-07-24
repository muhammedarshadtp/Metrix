
const userCollection = require("../../model/user-schema")


const login = async (req, res) => {
    try {

        if (!req.session.isAuth) {

            res.render('user_login', {

                emailError: req.flash('emailError'),
                statusError: req.flash('statusError'),
                passError: req.flash('passError'),


            })
        } else {
            res.redirect('/home')
        }
    } catch (error) {
        console.log(error);
        return res.render('error_page')
    }

}

const loginpost = async (req, res) => {
    try {
        const data = {
            email: req.body.email,
            password: req.body.password
        };

        const emailcollect = await userCollection.findOne({ email: data.email });

        if (!emailcollect) {
            const emailError = 'Email not found.' // Set specific error message
            return res.json({error:`${emailError}`});
        }

        if (!emailcollect.status) {
            const statusError= 'Your account has been disabled. Please contact support for assistance.';
            return res.json({error:`${statusError}`});
        }

        if (emailcollect.password !== data.password) {
            const passError = 'Invalid password.';
            
            return res.json({error:`${passError}`});
        }

        // Successful login logic
        req.session.isAuth = true;
        req.session.userId = emailcollect._id.toString();
        req.session.errorMsg = null; // Clear any previous error messages
        return res.json({result:"success"})
    } catch (error) {
        req.flash('error', 'An error occurred during login. Please try again later.');
        console.log(error);
        return res.redirect('/error_page')
    }
};



module.exports = {
    login,
    loginpost,

}