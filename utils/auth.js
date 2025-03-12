const passport = require('passport')
const dotenv = require('dotenv')

dotenv.config()


const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://metrixs.onrender.com/auth/auth/google/callback",
    // callbackURL: "http://localhost:3000/auth/auth/google/callback"
    passReqToCallback :true
  },
  function(request,accessToken, refreshToken, profile, done) {
    done(null, profile);
  }
));

passport.serializeUser((user,done)=>{
    done(null,user)
})

passport.deserializeUser((user,done)=>{
    done(null,user)
})
