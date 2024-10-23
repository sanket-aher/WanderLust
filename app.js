/* 
    Git Bash/Terminal :
    Installed nodejs npm packages:
    $npm i express
    $npm i ejs
    $npm i mongoose
    $npm i method-override
    $npm i ejs-mate (A boilerplate code that is embed with every ejs file)
    $npm i joi (The most powerful schema description language and data validator for JavaScript)
    $npm i express-session (An attempt to make our session stateful.Create a session middleware with given options: 1)secret,2)resave,etc.)
    $npm i connect-flash (To flash a message)
    $npm i passport (Passport is Express-compatible authentication middleware for Node.js)
    $npm i passport-local (Passport strategy for authenticating with a username and password)
    $npm i passport-local-mongoose (Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password login with Passport)
    $npm i multer ( Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. ) 
    $npm i dotenv  ( To access .env file => Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env ) 
    $npm i cloudinary ( The Cloudinary Node SDK allows you to quickly and easily integrate your application with Cloudinary. )
    $npm i multer-storage-cloudinary ( A multer storage engine for Cloudinary. )
    $npm install @mapbox/mapbox-sdk (A JS SDK for working with Mapbox APIs)
    $npm i connect-mongo (MongoDB session store for Connect and Express (for production))   
*/
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
//console.log(process.env) // => store .env file data

const express = require("express");
const app = express();
const mongoose =  require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js"); // throw custom error
const session = require("express-session"); // Storing and access/using information.
const MongoStore = require('connect-mongo'); // Storing session related information into production mongoDB Database
const flash = require('connect-flash'); // Flash a message
const passport = require('passport'); 
const LocalStrategy = require('passport-local');
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const dbUrl = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended:true})); // while sending data using 'POST' method the parsing is urlencoded format.
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate); // A boilerplate code that is embed with every ejs file


const store =MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret: process.env.SECRET // process.env.SECRET => string for encryption
    },
    touchAfter : 24 * 3600 
});

store.on("error",(error)=>{
    console.log("ERROR in MONGO SESSION STORE",error);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET, // process.env.SECRET => string for encryption
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // Set to 1 Week ( 7days * 24hour * 60min * 60sec * 1000ms )
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

app.use(session(sessionOptions)); // session middleware
app.use(flash()); // flash middleware


//passport middleware
app.use(passport.initialize()); // A Middleware that initialize passport
app.use(passport.session());    // A web application needs the ability to identify users as they browse from page to page.This series of requests and responses, each associated with the same user, is known as a session.

// use passport localStrategy method
passport.use(new LocalStrategy(User.authenticate()));  // authenticate() : Generates a function that is used in Passport's LocalStrategy

passport.serializeUser(User.serializeUser()); // serializeUser() : Generates a function that is used by Passport to serialize users into the session
passport.deserializeUser(User.deserializeUser()); // deserializeUser() : Generates a function that is used by Passport to deserialize users into the session

//flash middleware
app.use((req,res,next) =>{
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    //console.log(req.user);
    res.locals.currUser = req.user;  // store current login user information
    next();
});

// app.get("/",(req,res)=>{
//     res.send("hi, I am root");
// });

// Demo User Created
// app.get("/demouser",async (req,res)=>{
//     let fakeUser = {
//         email:"student1@gmail.com",
//         username:"student1"
//     };

//     // register() : Convenience method to register a new user instance with a given password. Checks if username is unique.
//     let registeredUser = await User.register(fakeUser,"helloworld"); 
//     res.send(registeredUser);
// });

//Routers
app.use("/listings",listingRouter);             // /listings => is common path from models/listing.js file
app.use("/listings/:id/reviews",reviewRouter);  // /listings/:id/reviews => is common path from models/review.js file
app.use("/",userRouter);                        // / => is common path from models/user.js file

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!")); // throw custom error if page not found
});


// error handler middleware
app.use((err,req,res,next)=>{
    let {statusCode = 500,message = "something went wrong"} = err;
    res.status(statusCode).render("./listings/error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("server is listening on port 8080");
});