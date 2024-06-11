
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
            req.flash('emailError', 'Email not found.'); // Set specific error message
            return res.redirect('/login');
        }

        if (!emailcollect.status) {
            req.flash('statusError', 'Your account has been disabled. Please contact support for assistance.');
            return res.redirect('/login');
        }

        if (emailcollect.password !== data.password) {
            req.flash('passError', 'Invalid password.');
            console.log('Flash message:', req.flash('error'));
            return res.redirect('/login');
        }

        // Successful login logic
        req.session.isAuth = true;
        req.session.userId = emailcollect._id.toString();
        req.session.errorMsg = null; // Clear any previous error messages
        res.redirect('/');
    } catch (error) {
        req.flash('error', 'An error occurred during login. Please try again later.');
        res.redirect('/login');
    }
};



module.exports = {
    login,
    loginpost,

}