const express = require("express");
const router = express.Router({ mergeParams: true }); // Enable mergeParams
const Comment = require("../models/comment");
const Blog = require("../models/blog");

router.post("/", async (req, res) =>{
    // console.log("this is user request",req.user);
    let {id} = req.params;
    // console.log(id);
    let blog = await Blog.findById(id);
    // console.log("this is blog", blog);
    let commentAdd = new Comment (req.body.comment);
    // console.log(commentAdd);
   let audd =  commentAdd.audiance = req.user._id;
//    console.log("this is aud", audd);
   
    await commentAdd.save();
    await blog.comments.push(commentAdd._id);
   
    blog.save();
    res.redirect(`/blogs/${blog._id}`)

});

module.exports = router;