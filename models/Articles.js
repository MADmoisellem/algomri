const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  avatar: {
    type: String,
    default: "https://cdn.onlinewebfonts.com/img_258083.png",
  },
  title: String,
  subtitle : String,
  content: String,
  description: String,
  author: String,
  createdAt : {
    type : Date,
    default : Date.now
  }, 
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
});

const articleModel = mongoose.model("Article", articleSchema);

module.exports = articleModel; 