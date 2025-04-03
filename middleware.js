
module.exports.isloggedIn = (req, res, next ) =>{
    // console.log("this is reqUser print", req.user);
if(!req.isAuthenticated()){ // rushi, req,
        req.flash("error", " you must be logged in, to create listing! ");
      return  res.redirect("/login");
    }
    next();
}
