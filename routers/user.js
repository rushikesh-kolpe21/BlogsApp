const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");


// singup
router.get("/singup", ( req, res) => {
    res.render("users/singup.ejs")
});

router.post("/singup",
    wrapAsync(
        async (req, res) => {
            try {
                let { username, email, password } = req.body;
                let newUser = await new User({email,username});
                let registerUser = await User.register(newUser,password);
                console.log("this new register user", registerUser);
                
                req.login(registerUser, (err) => {
                    if(err){
                      return next(err)
                    }
                    req.flash("success", "Welcome to Rushii blog's");
                    res.redirect("/blogs");
                })

            } catch (error) {
                console.log(error);
                req.flash("error", "try again!");
                res.redirect("/singup");
            }
    })
);

//login
router.get("/login" , (req, res) => {
    res.render("users/login.ejs")
});

router.post("/login",
    passport.authenticate("local",{ // Handles authentication using the passport library with the local strategy (username and password).
       failureRedirect: "/login", //If authentication fails, the user is redirected back to the /login page
        failureFlash:true,
    }), 
    async (req, res) => {
        req.flash("success","welcome back to wanderlust!");
        res.redirect("/blogs")
})


// log out 
router.get("/logout", (req, res, next ) => {
    req.logOut((err) => {
        if(err){
           next(err);
        }
        req.flash("success", " You Are SuccessFully LOGOUT:)");
        res.redirect("/blogs")
    })
})


    module.exports = router;

