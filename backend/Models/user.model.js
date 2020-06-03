const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  profilename: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  bio: {
    type: String,
    maxlength: 150,
  },
  location: {
    type: String,
    maxlength: 150,
  },
  messages: {
    type: Array,
    required: true,
  },
  total_mess_len: {
    type: Number,
    required: true,
  },
  comments: {
    type: Array,
    required: true,
  },
  liked_messages: {
    type: Array,
    required: true,
  },
  temp: {
    type: Array,
    required: true,
  },
  loggedin: {
    type: Number,
    required: true,
  },
  followers: {
    type: Array,
    required: true,
  },
  following: {
    type: Array,
    required: true,
  },
  notifications: {
    type: Array,
    required: true,
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
