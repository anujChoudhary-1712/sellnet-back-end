const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailVerified:{
    type:Boolean,
    default:false
  },
  emailToken:{
    type:String
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
  },
});

const usersModel = mongoose.model("users", userSchema);
module.exports = usersModel;