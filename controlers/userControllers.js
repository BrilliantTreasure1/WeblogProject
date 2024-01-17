const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');


const User = require('../models/User');
const { sendEmail } = require('../utils/mailer');

exports.Login = (req, res) =>{
    res.render("login" , 
    {pageTitle : "ورود به بخش مدریت" ,
     path :"/login" ,
     message : req.flash("sucsses-msg"),
     error : req.flash("error-msg")})
};

exports.handleLogin = (req , res , next) => {
  passport.authenticate("local" , {
    //successRedirect:"/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  }) (req,res,next)
}

exports.rememmber = (req , res) => {
  if (req.body.rememmber) {
    req.session.cookie.originalMaxAge = 24 * 60 * 60 *100;
  } else {
    req.session.cookie.expire = null;
  }
  res.redirect("/dashboard");
}

exports.logout = (req,res) => {
  req.session = null;
  req.logout(function(err) {
    if (err) { return next(err); }
  });
  //req.flash("succses-msg" , "خروج موقیت آمیز بود");
  res.redirect("/users/login")
}

exports.register = (req, res) =>{
    res.render("register" , {pageTitle : "ورود به بخش مدریت" , path :"/register"});
};

exports.creatUser = async (req , res) => {
  const errors = [];
    try {
      await User.userValidation(req.body);
      const {fullname , email , password} = req.body;

      const user = await User.findOne({email});
      if (user) {
        errors.push({message : "کاربری با این ایمیل موجود است"});
        return res.render("register", {
          pageTitle: "ثبت نام کاربر",
          path: "/register",
          errors,
        })
      }

      const hash = await bcrypt.hash(password , 10);
      await User.create({fullname, email , password:hash});
      req.flash("sucsses-msg", "ثبت نام موفقیت آمیز بود")
      res.redirect("/users/login")  

      
    } catch (err) {
      console.log(err);
      err.inner.forEach((e)=> {
        errors.push({
          name : e.path,
          message : e.message,
        });
      });
      return res.render("register", {
        pageTitle: "ثبت نام کاربر",
        path: "/register",
        errors,
      })
    }}; 

    exports.forgetPassword = async (req,res) => {
      res.render("forgetPass" , {
        pageTitle:"فراموشی رمزعبور",
        path:"/login",
        message : req.flash("success-message"),
        error: req.flash("error")
      })
    }

    exports.handleForgetPassword = async(req,res) => {
      const {email} = req.body;

      const user = await User.findOne({email : email})

      if (!user) {
        req.flash("error" , "کاربری یا این ایمیل در پایگاه داده نیست");

       return res.render("forgetPass" , {
          pageTitle:"فراموشی رمزعبور",
          path:"/login",
          message : req.flash("success-message"),
          error: req.flash("error")
        })
    }

    const token = jwt.sign({userId: user._id}, process.env.JWt_Secret,{expiresIn :"1h"} );

    const resetLink = `http://localhost:3000/users/reset-password/${token}`;

    sendEmail(
      user.email,
      user.fullname,
      "فراموشی رمز عبور",
      `جهت تغییر رمز عبور فعلی روی لینک کلیک کنید
      <a href="${resetLink}">لینک تغییر رمز عبور</a>`
    )

    req.flash("success-msg","ایمیل ارسال شد");

    res.render("forgetPass" , {
      pageTitle:"فراموشی رمزعبور",
      path:"/login",
      message : req.flash("success-message"),
      error: req.flash("error")
    })
    
  }

  
exports.resetPassword = async (req, res) => {
  const token = req.params.token;

  let decodedToken;

  try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decodedToken);
  } catch (err) {
      console.log(err);
      if (!decodedToken) {
          return res.redirect("/404");
      }
  }

  res.render("resetPass", {
      pageTitle: "تغییر پسورد",
      path: "/login",
      message: req.flash("success_msg"),
      error: req.flash("error"),
      userId: decodedToken.userId,
  });
};


exports.handleResetPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  console.log(password, confirmPassword);

  if (password !== confirmPassword) {
      req.flash("error", "کلمه های عبور یاکسان نیستند");

      return res.render("resetPass", {
          pageTitle: "تغییر پسورد",
          path: "/login",
          message: req.flash("success_msg"),
          error: req.flash("error"),
          userId: req.params.id,
      });
  }

  const user = await User.findOne({ _id: req.params.id });

  if (!user) {
      return res.redirect("/404");
  }

  user.password = password;
  await user.save();

  req.flash("success_msg", "پسورد شما با موفقیت بروزرسانی شد");
  res.redirect("/users/login");
};