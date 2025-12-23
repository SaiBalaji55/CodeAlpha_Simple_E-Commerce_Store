const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user" // user | admin
  }
});

module.exports = mongoose.model("User", userSchema);


//this is the user model file for ecommerce application in mongoose schema