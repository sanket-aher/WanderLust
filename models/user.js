/*
    Note : You're free to define your User Schema how you like email,age,dob,etc.
           Passport-Local Mongoose will add a username, hash and salt field to store the username,
           the hashed password and the salt value by default.
           Additionally, Passport-Local Mongoose adds some methods to your Schema
*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require('passport-local-mongoose'); // Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password login with Passport.

const userSchema = new Schema({
    email: {
        type : String,
        required : true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);