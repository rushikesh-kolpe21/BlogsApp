// express required
const express = require("express");
const app = express();


//session
const session = require("express-session");

//flash
const flash = require("connect-flash");

// configuring stategy.
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const {blogSchema} = require("./schema.js");

const ExpressError = require('./utils/ExpressError.js');
const wrapAsync = require("./utils/wrapAsync.js");

//schema ----------------------------------------------
const Blog = require("./models/blog");

const userBlogs = require("./routers/blog.js");
const userRouter = require("./routers/user.js");
const userComment = require("./routers/comment.js");
  
//ejs setup -------------------------------------------------
const path = require("path");
// Set up the views directory
app.set("views", path.join(__dirname, "views"));
// Set EJS as the templating engine
app.set("view engine", "ejs");
//--------------------------------------------------

//mate--------------------------------------------------
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
//---------------------------------------------------

// serve static files----------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));// to serve static files such as images, CSS files, and JavaScript files, use the express.static built-in middleware function in Express.
 //-------------------------------------------------------------------------

//--------------------------------------------
 const methodOverride = require('method-override'); // jab same request ati to on same router tab hay override kar deta
app.use(methodOverride('_method')); // mean this and above line is method override when we want to use PUT , DELELTE
app.use(express.urlencoded({extended:true})); //is used in Express.js to parse incoming request bodies with URL-encoded payloads
//-------------------------------------------------

// mongoose connection.
const mongoose = require('mongoose');
const MONG_URL = 'mongodb://127.0.0.1:27017/blogapp';
mongoose.set('strictQuery', false); // Or true, based on your preference , write before connection's



main() // rushi, async, arrow funcition
    .then(()=>{
        console.log(" connected  with mongoose");
   })
   .catch((err) =>{
        console.log("not connected to mongoose", err);
   })
async function main(){
   await mongoose.connect(MONG_URL);
};

const sessionOption = {
   secret: "mysupersecretcode", 
   resave: false,
   saveUninitialized: true,
};

app.use(session(sessionOption));
app.use(flash());


// for checking
app.get("/", ( req, res ) =>{
   res.send(" HI RUSII...");
   console.log("HI RUSHI...");
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // store user related information in session
passport.deserializeUser(User.deserializeUser());// unstore user related information in session


app.use((req, res, next ) => {
   res.locals.successMsg = req.flash("success");
   res.locals.errorMsg = req.flash("error");
   res.locals.currentUser = req.user;
   next()
});

app.get("/demouser", async (req, res) => {
   let fakeUser = new User({
      email: "student@gmail.com",
      username: "delta-student",
   });
   let registereUser = await User.register(fakeUser, "helloworld");
   res.send(registereUser);
});

// I guess this will define will in last
app.use("/blogs", userBlogs);
app.use("/", userRouter);
app.use("/blogs/:id/comments", userComment);


// Jo error app.all("*", (req, res, next)) 
// se create hoti hai, vo next() ke zariye 
// app.use((err, req, res, next)) middleware tak pass hoti hai,
//  aur wahi middleware us error ko handle karta hai.

app.all("*", (req, res, next) => {
   next(new ExpressError(404, "page nott found!"));
});

app.use((err, req, res, next) => {
   const { statusCode = 500, message = "Something went wrong" } = err; 
   res.render("error.ejs", {message});
   // res.status(statusCode).send(message); 
});

app.listen(5000, ()=>{
   console.log("BLOGING APP WILL STARTED 5000")
});

