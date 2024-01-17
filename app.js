const path =require('path');

const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const expressLayout = require('express-ejs-layouts');
const passport = require('passport');
const dotenv = require('dotenv');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore =  require("connect-mongo");
const connectDB = require("./config/db");
const indexRoutes = require('./route');
const dashboardRoutes = require('./route/dashboard'); 
const UsersRoute = require('./route/users');


//Load config
dotenv.config({path:"./config/config.env"})

//* Database connection
connectDB();   

//Passport configuration
require("./config/passport");


const app = express();

//view engine
app.use(expressLayout);
app.set("view engine" , "ejs");
app.set("layout", "./layout/mainLayout")
app.set('views' ,'views');

//BodyParser
app.use(express.urlencoded({extended:false}));

//FileUpload
app.use(fileUpload());

//session
app.use(session({
    secret :"secret",
    cookie: {maxAge : null},
    resave : false,
    saveUninitialized : false,
    unset : "destroy",
    store : new MongoStore( { mongoUrl : "mongodb://localhost:27017/blog_db"})
}))

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Flash
app.use(flash());

//static
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname,"node_modules","bootstrap-rtl","dist")));
app.use(express.static(path.join(__dirname,"node_modules","bootstrap","dist")));


//routes
app.use(indexRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/users" , UsersRoute);

//404 Page
app.use((req,res) => {
    res.render("404",{pageTitle:"404" ,path: "/404"})
})



const PORt = process.env.PORt || 5000;

app.listen(PORt ,console.log("yo its running"));

