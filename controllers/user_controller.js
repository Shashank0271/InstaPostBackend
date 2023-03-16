const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../errors/custom-error");
const User = require("../models/User");

const createUser = async (req, res) => {
  console.log("entered create user controller");
  const newUser = await User.create(req.body);
  res
    .status(StatusCodes.OK)
    .json({ message: "user created successfully", newUser });
};

const getUser = async (req, res) => {
  console.log("entered get user controller");
  const firebaseUid = req.params.id;
  const user = await User.findOne({ firebaseUid: firebaseUid });
  console.log(user);
  if (!user)
    throw new CustomAPIError("user does not exist", StatusCodes.NOT_FOUND);
  console.log(user);
  res.status(StatusCodes.OK).json(user);
};

const updateUser = async (req, res) => {
  console.log("entered update user controller");
  const { firebaseUid, userName } = req.body;
  const user = await User.find({ firebaseUid: firebaseUid });
  if (userName != undefined) {
    user.username = userName;
  }
  await User.updateOne(
    { firebaseUid: firebaseUid },
    { username: user.username }
  );
  res.status(StatusCodes.OK).json({ message: "profile updated successfully" });
};

const followUser = async (req, res) => {
  console.log("enter follow user controller");
  const { currentUserFid, followedUserFid } = req.body;
  const currentUser = await User.findOne({ firebaseUid: currentUserFid });
  const followedUser = await User.findOne({ firebaseUid: followedUserFid });
  currentUser.following.push(followedUserFid);
  followedUser.followers.push(currentUserFid);
  await User.updateOne(
    { firebaseUid: currentUserFid },
    { following: currentUser.following }
  );
  await User.updateOne(
    { firebaseUid: followedUserFid },
    { followers: followedUser.followers }
  );
  return res
    .status(StatusCodes.OK)
    .json({ message: "user followed successfully" });
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  followUser,
};
