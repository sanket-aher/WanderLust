const express = require("express");
const router = express.Router({ mergeParams: true}); // Express Router are a way to organize your express application such that our primary app.js file does not become bloated.
const wrapAsync = require("../utils/wrapAsync.js"); // error handler class using wrapAsync function or try catch block
const Review = require("../models/review.js"); // Review Schema
const Listing = require("../models/listing.js"); //Listing Schema
const { validateReview, isLoggedIn, isReviewAuthor } = require("../Middleware.js");

const reveiwController = require("../controllers/reviews.js");


// 6)POST Review Route - POST method - /listings/:id/reviews - to post the review data in listings model
router.post("/", isLoggedIn, validateReview ,wrapAsync(reveiwController.createReview));

// 7)Delete Review Route - DELETE method - /listings/:id/reviews/:reviewId - to delete data from listings and reviews model
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reveiwController.destroyReview));

module.exports = router;
