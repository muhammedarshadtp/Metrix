const userCollection = require("../../model/user-schema")



const admin_loginGet = async (req, res) => {
    try {
        if (req.session.isAdminAuth) {
            res.redirect('/admin/dashboard')
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

        const isAdmin = await userCollection.findOne({ email: req.body.email })
        console.log('adminloginpost');
        console.log(isAdmin)
        if (isAdmin) {
            console.log('isadminif')
            if (isAdmin.password === req.body.password && isAdmin.admin == true) {
                console.log('if')
                req.session.isAdminAuth = true
                res.redirect('/admin/dashboard')
            } 
        }else {
            console.log('else')
            req.session.adminError = 'admin is not valid'
            res.redirect('/admin/login')
        }




    } catch (error) {

    }

}


const admin_logoutGet = async (req, res) => {
    req.session.isAdminAuth = false
    res.redirect('/admin')
}






module.exports = {
    admin_loginGet,
    admin_loginPost,
    admin_logoutGet,

}