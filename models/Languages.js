const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const langSchema = new Schema({
  lang:{
    type: String,
    required: true,
    ref: "Languages"
  }
});

const langModel = mongoose.model("Languages", langSchema);

module.exports = langModel;