const express = require('express');
const mongoose = require('mongoose')

//session
const session = require('express-session');

//routers objects
const eventRouter = require('./routes/eventRoute');
const userRouter = require('./routes/userRoute');


const passport = require('passport')
// creat server express
const app = express();

app.use(express.json())
// config  pssport 
require('./config/passport')(passport)
// connect databae
mongoose.connect("mongodb://localhost/yallaDealz")
.then(()=>console.log("db yalla dealz is connected"))
.catch(eror=> console.log("error in connection to db"))

//body parser
app.use(express.urlencoded({extended:false}))

//express session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  //  cookie: { secure: true }
  }))

//password midare
app.use(passport.initialize());
app.use(passport.session());
// routers of client 
app.get('/',(req,res)=>{
    res.send("main page")
})
//use route
app.use('/event',eventRouter);
app.use('/user',userRouter);

//listen to the port 
const port = process.env.port ||3000
app.listen(port,()=> console.log('server listen to port ' + port.toString()))
