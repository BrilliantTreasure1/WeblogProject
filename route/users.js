const {Router} = require('express');

const userController = require('../controlers/userControllers');

const { authenticated } = require('./middlewares/auth');



const router = new Router();


//@desc login page
//@route Get/users/login
router.get("/login",userController.Login )


//@desc Handle login
//@route post/users/login
router.post("/login",userController.handleLogin ,userController.rememmber )


//@desc Handle Logout
//@route post/users/login
router.get("/logout", authenticated ,userController.logout )


//@desc register page
//@route Get/users/register
router.get("/register",userController.register);

//@desc ForgetPassword page
//@route Get/users/forget-password
router.get("/forget-password",userController.forgetPassword)

//@desc ForgetPassword page
//@route Get/users/forget-password
router.get("/reset-password/:token",userController.forgetPassword)

//@desc handle Forget Password 
//@route post/users/forget-password
router.post("/forget-password",userController.handleForgetPassword)

//@desc register page
//@route Get/users/register
router.post("/register", userController.creatUser)

module.exports = router;