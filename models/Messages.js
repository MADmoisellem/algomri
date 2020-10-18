const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const msgSchema = new Schema({
  date : Date,
  subject: String,
  message: String,
  recipient : {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
});

const msgModel = mongoose.model("Message", msgSchema);

module.exports = msgModel;