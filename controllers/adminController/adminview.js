const userCollection = require("../../model/user-schema")



const admin_loginGet = async (req, res) => {
    try {
        if (req.session.isAdminAuth) {
          return   res.redirect('/admin/dashboard')
        } else {

            const error = req.session.adminError
            req.session.adminError = null
            console.log(error, '././././');
            res.render('admin_login', { error })
           
        }
    } catch (error) {
        console.log(error);
    }
}

const admin_loginPost = async (req, res) => {

    try {

        const isAdmin = await userCollection.findOne({ email: req.body.email,admin:true })
        console.log('adminloginpost');
        console.log(isAdmin,"admin kitty")
        if (isAdmin) {
            console.log('isadmin')
            if (isAdmin.password === req.body.password) {
                console.log('if')
                req.session.isAdminAuth = true
                res.redirect('/admin/dashboard')
            } else{
                console.log('else')
                req.session.adminError = 'incorrect password'
                res.redirect('/admin/login')
            }
        }else {
            console.log('else')
            req.session.adminError = 'admin is not valid'
            res.redirect('/admin/login')
        }




    } catch (error) {
        console.log(error);
    }

}


const admin_logoutGet = async (req, res) => {
   try {
    req.session.isAdminAuth = false
    res.redirect('/admin')
   } catch (error) {
    console.log(error);
   }
}






module.exports = {
    admin_loginGet,
    admin_loginPost,
    admin_logoutGet,

}