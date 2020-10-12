const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  label:{
    type: String,
    required: true,
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  },
});

const categoryModel = mongoose.model("Category", categorySchema);

module.exports = categoryModel;

/* 
----------- category ----
id: 1
label: "cuisine"
parent: null
----
id: 2
label: "cuisine vietnamienne"
parent: 1
----
id: 3
label: "cuisine vietnamienne sud"
parent: 2
*/