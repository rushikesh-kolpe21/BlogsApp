const mongoose = require("mongoose");
const initData = require("./data.js"); // this file name , not a key

const Blog = require("../models/blog.js"); // for schema
const MONGO_URL = "mongodb://127.0.0.1:27017/blogapp";

// calling to main function
main()
  .then(() => {
    console.log("connected to dbB");
  })
  .catch(() => {
    console.log(err);
  });
// this main function is to connect to the database
async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
  await Blog.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "6797d03c54879781431ffd24",
  }));
  await Blog.insertMany(initData.data);
  console.log("data was initialized");
};

initDb();
