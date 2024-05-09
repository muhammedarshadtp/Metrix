const userCollection = require("../../model/user-schema")









const admin_loginGet = async(req,res)=>{
    if(req.session.isAdminAuth){
        res.redirect('/admin/dashboard')
    }else{

        const error = req.session.adminError
        res.render('admin_login',{error})
    }
}

const admin_loginPost =async(req,res)=>{

    try {

     const isAdmin = await userCollection.findOne({email:req.body.email})
     
     if(isAdmin.password === req.body.password && isAdmin.admin==true){
        req.session.isAdminAuth=true
        res.redirect('/admin/dashboard')
     }else{
        req.session.adminError = 'admin is not valid'
        res.redirect('/admin/login')
     }


    } catch (error) {
        
    }

}


const admin_logoutGet=async(req,res)=>{
    req.session.destroy()
    res.redirect('/admin')
}






module.exports={
    admin_loginGet,
   admin_loginPost ,
   admin_logoutGet,

}