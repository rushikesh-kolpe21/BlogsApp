const mongoose = require("mongoose");
const Blog = require("./models/blog"); // Model ka sahi path check karo

const createBlog = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/blogapp"); // DB name change kar sakte ho

        let newBlog = new Blog({ title: "Blog Post 1" });
        await newBlog.save();
        
        console.log("📝 New Blog Created:", newBlog);

        mongoose.connection.close(); // Connection close mat bhoolna
    } catch (error) {
        console.error("❌ Error:", error);
    }
};

createBlog();
