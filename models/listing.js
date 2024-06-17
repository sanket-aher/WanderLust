const mongoose = require("mongoose");
const Review = require("./review.js");
const { required } = require("joi");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type:String,
        required: true
    },
    description: String,
    // image: {
    //     type: String,
    //     default: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //     set: (v) => v === ""  // set : it is use to set default image url if empty url insert by an user
    //                 ? "https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    //                 : v
    // },
    image: {
        url:String,
        filename:String,
    },
    category:{
        type:String,
        enum: ["Trending","Rooms", "City", "Mountains", "Castle", "Pools", "Camping", "Farms","Arctic","Domes","Boats"]
    },
    price: Number,
    location: String,
    country: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner : {
        type: Schema.Types.ObjectId,
        ref:"User" 
    },
    geometry: {  /*  GeoJSON Fromat : GeoJSON is a format for storing geographic points and polygons  */
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      }
}); 

// Handling Listing Deletion Middleware
listingSchema.post("findOneAndDelete", async (listingData) =>{
    if(listingData){
        await Review.deleteMany({ _id: { $in : listingData.reviews }});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
