const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/codealpha_ecommerce");
  console.log("MongoDB Connected");
};

module.exports = connectDB;




//this is a connection file for mongodb database using mongoose package