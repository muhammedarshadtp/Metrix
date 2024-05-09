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

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
const path = require('path');
const nocache = require("nocache");
const flash = require('express-flash');
const userCollection = require("./model/user-schema");

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



app.set('views',[
    path.join(__dirname,'views/user'),
    path.join(__dirname,'views/admin')
])




app.get('/admin',(req,res)=>{
    res.render('admin_login')
})



app.use('/',userRouter)
app.use('/admin',adminRouter)
app.use('/auth',authRouter)


app.listen(port,()=>console.log(`server started ${port}`))