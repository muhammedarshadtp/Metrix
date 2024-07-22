const userModel=require('../model/user-schema')
const user_auth = async (req,res,next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.render('user_login')
    }
}

// const auth = async (req,res,next)=>{
//     if(!req.session.isAuth){
//         console.log('keri');
//         next()
        
//     }else{
//         res.render('user_home')
//     }
// }


const status=async(req,res,next)=>{
    try {
        const id =req.session.userid
        const user=await userModel.findById(id)
        if(user.status===true)
        {
            next()
        }
        else{
            res.redirect('/login')
        }
    } catch (error) {
        
    }
}

module.exports = {user_auth,status,}
