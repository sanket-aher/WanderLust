const Listing = require("./models/listing.js"); //Listing Schema
const Review = require("./models/review.js"); //Review Schema
const ExpressError = require("./utils/ExpressError.js"); // throw custom error
const {listingSchema,reviewSchema} = require("./schema.js"); // Joi Validation for Listing Schema, Review Schema , if any data try to insert from hoppscotch.io or postman

module.exports.isLoggedIn = (req,res,next)=>{
    //console.log(req.user); // passport store user information
    if(!req.isAuthenticated()) //req.isAuthenticated() : it is an passport package method and will return true if user is logged in
    {
        req.session.redirectUrl = req.originalUrl;  // redirectUrl save
        req.flash("error","You must be logged In!"); // Flash a error message if user try add new listing,delete or update listing without login
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req,res,next) =>{
        let {id} = req.params;

        //Check the owner to update the listing permissions
        let listing = await Listing.findById(id);
        if(!listing.owner.equals(res.locals.currUser._id)) {
            req.flash("error","You are not the owner of this listing"); // Flash a error message if another owner try to update a listing
            return res.redirect(`/listings/${id}`);
        }
        next();
}

/* Joi Validation for Lising Schema Middleware, if any data try to insert from hoppscotch.io or postman */
module.exports.validateSchemaListing = (req,res,next)=>{ 
    let {error} = listingSchema.validate(req.body);
    if(error){
       let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400,errMsg);
    }else{
       next();
    }
}

/* Joi Validation for Review Schema Middleware, if any data try to insert from hoppscotch.io or postman */
module.exports.validateReview = (req,res,next)=>{ 
    let {error} = reviewSchema.validate(req.body);
    if(error){
       let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400,errMsg);
    }else{
       next();
    }
}

module.exports.isReviewAuthor = async (req,res,next) =>{
    let {id,reviewId} = req.params;

    //Check the author to delete the Review permissions
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error","You are not the author of this review"); // Flash a error message if another rvview author try to delete a review
        return res.redirect(`/listings/${id}`);
    }
    next();
}