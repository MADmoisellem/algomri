const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  avatar: {
    type: String,
    default: "https://cdn.onlinewebfonts.com/img_258083.png",
  },
  name: String,
  lastname : String,
  username: String,
  email: String,
  password: {
    min: 8,
    required: true,
    type: String,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;