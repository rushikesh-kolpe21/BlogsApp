const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema ({
        content : String ,
        audiance: {
            type: Schema.Types.ObjectId,
            ref: "User", // Comment author
        },
        createdAt:{
            type : Date,
            default : Date.now,
        },
})

const Comment = mongoose.model("Comment",commentSchema);

module.exports = Comment;