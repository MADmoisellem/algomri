const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  avatar: {
    type: String,
    default: "https://image.freepik.com/vecteurs-libre/illustration-caractere-personnes-detenant-icones-compte-utilisateur_53876-66068.jpg",
  },
  name: String,
  lastname : String,
  username: String,
  email: String,
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  }
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;