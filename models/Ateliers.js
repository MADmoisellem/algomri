const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const atelierSchema = new Schema({
  avatar: {
    type: String,
    default: "https://images.unsplash.com/photo-1594621663599-037203c826d7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2539&q=80",
  },
  date : Date,
  title: String,
  description : String,
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
  authors: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
  lang: {
    type: Schema.Types.ObjectId,
    ref: "Languages"
  }
});

const atelierModel = mongoose.model("Atelier", atelierSchema);

module.exports = atelierModel;