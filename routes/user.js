const express = require("express");
const router = express.Router(); // Express Router are a way to organize your express application such that our primary app.js file does not become bloated. 
const wrapAsync = require("../utils/wrapAsync.js"); // error handler class using wrapAsync function or try catch block
const User = require("../models/user.js");
const passport = require('passport');
const { saveRedirectUrl } = require('../Middleware.js');

const userControllers = require("../controllers/users.js");

/* router.route() : Returns an instance of a single route which you can then use to handle HTTP verbs with optional middleware.
                    Use router.route() to avoid duplicate route naming and thus typing errors. */

// 1)SignUp User
router.route("/signup")
    .get(userControllers.renderSignupForm)     //a)SignUp Form - GET method - /signup -  to submit user signup form data
    .post(wrapAsync(userControllers.signup));  // b)SignUp Create User - POST method - /signup - A submitted user signup form data is to submit in mongoDB database

// 2)Login User
router.route("/login")
    .get(userControllers.renderLoginForm)   //a)Login Form - GET method - /login -  to submit user login form data
    .post(                         // b)Login Registered User - POST method - /login - A submitted user login form data is to validate with already user registered with passport.authenticate middleware
        saveRedirectUrl,
        passport.authenticate('local', { failureRedirect: '/login' , failureFlash: true }),
        wrapAsync(userControllers.login)
    );

// 3)Logout User
router.get("/logout",userControllers.logout);

module.exports = router;
