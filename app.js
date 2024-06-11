const express=require("express")

const session = require("express-session")
const app=express()

const port=3000
const connectDB=require('./config/db')
connectDB()
const userRouter=require('./route/userRouter')
const adminRouter=require('./route/adminRoute')
const authRouter = require('./route/authRoute')
app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const path = require('path');
const nocache = require("nocache");
// const flash = require('express-flash');
const flash = require('connect-flash');


require('./utils/auth')
const passport = require('passport')
app.use(passport.initialize())

app.use(flash());

app.use(nocache())

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    
    res.locals.error_MSG = req.flash('error_MSG');
    res.locals.error_msg = req.flash('error_msg');
    next();
});



app.set('views',[
    path.join(__dirname,'views/user'),
    path.join(__dirname,'views/admin')
])




app.get('/admin',(req,res)=>{
    res.render('admin_login',{error:''})
})



app.use('/',userRouter)
app.use('/admin',adminRouter)
app.use('/auth',authRouter)


app.listen(port,()=>console.log(`server started ${port}`))