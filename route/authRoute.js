const express = require('express')
const router = express.Router()
// const flash = require('express-flash')





require('../utils/auth')
const passport = require('passport')
const userCollection = require('../model/user-schema')



//GOOGLE AUTHENTCATION
router.get('/auth/google',
passport.authenticate('google', { scope: ['email','profile'] }));

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  async function(req, res) {
    const user = req.user
   
    const userData = {
        name: user.displayName,
        email: user.emails[0].value
      }

     
      try {
        const alreadyLoginUserData = await userCollection.findOne({email:userData.email})
        if(alreadyLoginUserData ){
        //   const yes = alreadyLoginUserData.status
          console.log(alreadyLoginUserData);
          if(alreadyLoginUserData.status==false){
            
            req.session.isAuth=false;
            req.flash('statusError', 'User account is disabled. Please contact support.');
            return res.redirect('/login')
          }else{
            req.session.isAuth=true
            req.session.userId=alreadyLoginUserData._id
            res.redirect('/');
          }
           
        }else{
            const createdUser = await userCollection.create(userData);
            req.session.isAuth=true   
            req.session.userId=alreadyLoginUserData._id         
            res.redirect('/');
        }
        
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
  });


  



module.exports = router