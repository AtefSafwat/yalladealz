const express = require('express');
const mongoose = require('mongoose')
const auth = require('./middleware/auth')
const adminAuth = require('./middleware/adminAuth')
//session
const session = require('express-session');
const flash = require('express-flash')

//routers objects
const eventRouter = require('./routes/eventRoute');
const userRouter = require('./routes/userRoute');


// creat server express
const app = express();

app.use(express.json())

// connect databae
mongoose.connect("mongodb://localhost/yallaDealz")
.then(()=>console.log("db yalla dealz is connected //////////////////////////////////"))
.catch(eror=> console.log("error in connection to db"))

//body parser
app.use(express.urlencoded({extended:false}))

//express session
app.use(flash())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  //  cookie: { secure: true }
  }))
  const passport = require('passport')
// config  pssport 
require('./config/passport')(passport)
//password midare
app.use(passport.initialize());
app.use(passport.session());
// routers of client 
app.post('/login',    
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
        
)
app.delete('/logout',(req,res)=>{
    req.logOut()
    res.redirect ('/login')   
})
    

app.get('/',(req,res)=>{
    res.send("main page "+req.user.name+" "+req.user.role)
})
app.get('/login',(req,res)=>{
    res.send("login")
})
//use route
app.use('/event',eventRouter);
app.use('/user',userRouter);

//listen to the port 
const port = process.env.port ||3000
app.listen(port,()=> console.log('server listen to port ' + port.toString()))
