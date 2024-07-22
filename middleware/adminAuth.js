const admin_auth = async (req,res,next)=>{
    if(req.session.isAdminAuth&&req.session){
        console.log(req.session.isAdminAuth,'pppppp',req.session);
        next()
    }else{
        res.redirect('/admin/login')
    }
}

module.exports = admin_auth