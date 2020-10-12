const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  avatar: {
    type: String,
    default: "https://cdn.onlinewebfonts.com/img_258083.png",
  },
  date: Date,
  title: String,
  description: String,
  adress : {
    numero: Number,
    rue: String,
    code_postale: Number,
    ville: String,
    pays: String
    },
  participants: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
});

const eventModel = mongoose.model("Event", eventSchema);

module.exports = eventModel;