// require mongoose
const mongoose = require("mongoose");
// schema
const Schema = mongoose.Schema;

// the process of managing user authentication by handling:
const passportLocalMongoose = require("passport-local-mongoose"); // require :) password and user_name will defien automatic.


const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose); // automaticll implement user_name , password, hashing password, salting.

 let User = mongoose.model("User", userSchema)

 module.exports = User; 