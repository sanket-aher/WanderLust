const Review = require("../models/review.js"); // Review Schema
const Listing = require("../models/listing.js"); //Listing Schema

module.exports.createReview = async (req,res) =>{
    let listing = await Listing.findById(req.params.id);

    // let {comment,rating,createdAt}=req.body;
                //OR
    let newReview = new Review(req.body.review);
    
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","New Review Created!"); // Flash a message after adding a new Review
    res.redirect(`/listings/${listing._id}`); // OR  res.redirect(`/listings/${req.params.id}`);
};

module.exports.destroyReview = async (req,res)=>{
    let { id, reviewId } = req.params;

// $pull - The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // On Update there is operator called '$pull' like a $set
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","Review Deleted!"); // Flash a message after delete a review
    res.redirect(`/listings/${id}`);
};