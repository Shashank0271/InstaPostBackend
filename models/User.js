const mongoose = require("mongoose");

const User = mongoose.Schema({
  username: {
    type: String,
    required: [true, "a  username must be provided"],
  },
  email: {
    type: String,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
    required: [true, "an email must be provided"],
  },
  firebaseUid: {
    type: String,
    unique: true,
    required: [true, "firebase UID must be provided"],
  },
  registrationToken: {
    type: String,
    required: [true, "fcm registration token must be provided"],
  },
  postCount: {
    type: Number,
    default: 0,
  },
  followersTokens: {
    type: [String],
    default: [],
  },
  followers: {
    type: [String],
    default: [],
  },
  following: {
    type: [String],
    default: [],
  },
  likedPosts: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model("user", User);
