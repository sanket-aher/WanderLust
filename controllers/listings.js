const Listing = require("../models/listing.js"); //Listing Schema

/* Geocoding : Geocoding is the process of converting addresses (like a street address) into geographic coordiates (like latitude and longitude), which you can use to place markers on a map, or position the map. */
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});

    const { search, minPrice, maxPrice, category } = req.query;

    let result = allListings;

    // If search parameter is provided, filter by country or location
    if (search) {
        const searchTerms = search.split(' ');
        const regexTerms = searchTerms.map(term => new RegExp(term, 'i'));
        const searchQuery = {
            $or: [
                { country: { $in: regexTerms } },
                { location: { $in: regexTerms } },
            ],
        };

        result = await Listing.find(searchQuery);
    }

    // If category parameter is provided, filter by category
    if (category && category.length > 0) {
        result = result.filter(listing => category.includes(listing.category));
    }

    // If minPrice or maxPrice parameters are provided, filter by price range
    // if (minPrice || maxPrice) {
    //     const min = minPrice ? parseInt(minPrice) : Number.MIN_SAFE_INTEGER;
    //     const max = maxPrice ? parseInt(maxPrice) : Number.MAX_SAFE_INTEGER;

    //     result = result.filter(listing => listing.price >= min && listing.price <= max);
    // }

    res.render("./listings/index.ejs",{allListings:result,search});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}})  //populate => to show all child details
                                              .populate("owner"); //populate => to show all child details
    
    if(!listing){
        req.flash("error","Listing you requested for does not exist!"); // Flash a error message if listing is not exist
        res.redirect("/listings");
    }

    res.render("./listings/show.ejs",{listing});
};

module.exports.createListing = async (req,res,next)=>{
    try{      // error handler class using wrapAsync function or try catch block

        // Find co-ordinates using location to display on map
        let response = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
          }).send();



        // let {title,description,image,price,country,location,category}=req.body;
                //OR
        let data = req.body.listing;
          console.log(data);

        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(data);
        newListing.owner = req.user._id;
        newListing.image = {url,filename}; // store image related data into database
        newListing.geometry = response.body.features[0].geometry;  // store map co-ordinates related data into database  

        await newListing.save();
        req.flash("success","New Listing Created!"); // Flash a message after adding a new listing
        res.redirect("/listings");
    } catch(err){
        next(err); // calling error middleware
    }
};

module.exports.renderEditForm = async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);

    if(!listing){
        req.flash("error","Listing you requested for does not exist!"); // Flash a error message if listing is not exist
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250"); // make original image quality low to preview it

    res.render("./listings/edit.ejs",{ listing , originalImageUrl });
};

module.exports.updateListing = async (req,res)=>{ //error handler class using wrapAsync function or try catch block
    // AFTER edit location geometry coordinates has to be updated
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      }).send();
    
    let {id} = req.params;

    // let {title,description,image,price,country,location}=req.body;
            //OR
    let data = req.body.listing;
    data.geometry = response.body.features[0].geometry;  // store map co-ordinates related data into database  

    let listing = await Listing.findByIdAndUpdate(id, {...data});
    
    if(typeof req.file !== "undefined")
    {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    

    req.flash("success","Listing Updated!"); // Flash a message after updated a listing
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!"); // Flash a message after delete a listing
    res.redirect("/listings");
};