const User = require("../models/user.js");

module.exports.renderSignupForm = (req,res)=>{
    res.render("./users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});

        //register() : Convenience method to register a new user instance with a given password. Checks if username is unique.
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);

        //After signup user will automatically login
        req.login(registeredUser,(err) =>{  // req.login : It is an passport method.
                                            //             Passport exposes a login() function on req (also aliased as logIn()) that can be used to establish a login session.
                                            //             When the login operation completes, user will be assigned to req.user. 
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLust!");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req,res)=>{
    res.render("./users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res)=>{
    // req.logout : It is an passport method.Passport exposes a logout() function on req (also aliased as logOut()) that can be called from any route handler which needs to terminate a login session. Invoking logout() will remove the req.user property and clear the login session (if any).
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
};