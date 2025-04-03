const express = require("express");
const router = express.Router({})
const ExpressError = require('../utils/ExpressError.js');
const wrapAsync = require("../utils/wrapAsync.js");
const {blogSchema} = require("../schema.js");
const Blog = require("../models/blog");
const {isloggedIn} = require("../middleware.js");  //({ isloggedIn }) because you only needed the isloggedIn function from middleware.js.
const Comment = require("../models/comment.js")
const mongoose = require("mongoose");
// validation for schema. 
const validationBlog =(req, res, next)=>{
    let {error} = blogSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    } else{
        next()
    }
 };


// index router : to display all cards
router.get("/" , 
wrapAsync(async (req, res ) => {
   // console.log(" resquest on bolgs");
   let allblogs = await Blog.find({}) // rushi, Blog
   res.render("blogs/index.ejs", {allblogs})
})
);

// when add blog btn click : then render only from
router.get('/new',
   isloggedIn,
    (req, res) => {
   res.render('blogs/new'); 
});

    // console.log(req);
    

// when above router render form fill then save db .
router.post("/",
   validationBlog,
   wrapAsync( async (req, res) => {
   try {
      console.log("Incoming Request Body:", req.body);
       const newBlog = new Blog(req.body.blog);// (.)blog add kar naay kay matlab object is blog ko remove karn and save db rushi, jo joi blog use kiya vahi.blog use karo
      //  newListing.owner = req.user._id;// owner ke id save karta hayy newlisting ka andhar.
       newBlog.owner = req.user._id // owner ke id save karta hayy newlisting ka andhar.
       console.log("this is new blogs", newBlog)
       await newBlog.save(); 
       console.log("Blog created:", newBlog);
       res.redirect("/blogs");
   } catch (error) {
       console.error("Error creating blog:", error);
       res.status(500).send("Internal Server Error");
   }
})
);

// show router : show single card     
router.get("/:id",
   wrapAsync(async (req, res) => {
      let { id } = req.params;
   
      let newId = await Blog.findById(id).populate("owner") 
      .populate({
        path: "comments",
        populate: {
          path: "audiance",
         //  model: "User", // ✅ Ensure model name is correct
         //  select: "email username", // ✅ Fetch only required fields
        },
      });

      // const comments = await Comment.find().populate("audiance");
      // console.log("this is comments",comments);

   
      // // ✅ Convert to JSON for debugging
      // console.log(JSON.stringify(newId, null, 2));
      // console.log("this is array",newId.comments[0].audiance); // ✅ Should show full object
      // console.log("this new id new", newId)
      res.render("blogs/show.ejs", { newId }); 
   }));
   



//edit : for only enter to edit in form
router.get("/:id/edit", 
   isloggedIn,
wrapAsync(async (req, res) =>{
   let {id}= req.params;
  let blog = await Blog.findById(id);
  res.render("blogs/edit.ejs", {blog});

})
);

// after edit done : publish
router.put("/:id", 
   validationBlog,
   wrapAsync(
   async (req, res) => {
   let {id} = req.params;
   let body = req.body.blog;
   console.log(body);
  await Blog.findByIdAndUpdate(id, {...body}); // rushi, spread object into title , content , author
   res.redirect("/blogs");
})
);


// delete
router.delete("/:id" ,
   isloggedIn,
wrapAsync( async (req , res) => {
   let {id} = req.params;
   console.log(id);
   await Blog.findByIdAndDelete(id);
   res.redirect("/blogs")
})
); 

module.exports = router;