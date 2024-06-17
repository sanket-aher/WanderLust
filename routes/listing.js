const express = require("express");
const router = express.Router(); // Express Router are a way to organize your express application such that our primary app.js file does not become bloated. 
const wrapAsync = require("../utils/wrapAsync.js"); // error handler class using wrapAsync function or try catch block
const Listing = require("../models/listing.js"); //Listing Schema
const { isLoggedIn,isOwner,validateSchemaListing } = require("../Middleware.js");

const multer  = require('multer'); // Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files.
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage }); // to save the 'file' form data(i.e our image) into cloudinary

const listingController= require('../controllers/listings.js');


// 1)Index Route - GET method - /listings - to show all listings data
router.get("/",wrapAsync(listingController.index));


// 3)New and Create Route 

// a)New Route : GET method - /listings/new - a new form to submit data
router.get("/new",isLoggedIn,listingController.renderNewForm);

// b)Create Route : POST method - /listings - a submitted data to submit in mongoDB database  
router.post("/",isLoggedIn,upload.single('listing[image]'),validateSchemaListing,listingController.createListing);



// 2)Show Route - GET method - /listings/:id - to show particular data
router.get("/:id",wrapAsync(listingController.showListing));

// 4)Edit and Update Route

// a)Edit Route : GET method - /listings/:id/edit - to edit the form
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// b)Update Route : PUT method - /listings/:id - to update the edited form into the mongoDB database
router.put("/:id",isLoggedIn,isOwner,upload.single('listing[image]'),validateSchemaListing,wrapAsync(listingController.updateListing)
);

// 5)Delete Route - DELETE method - /listings/:id - to delete the record
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports = router;