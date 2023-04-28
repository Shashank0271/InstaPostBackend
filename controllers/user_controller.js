const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../errors/custom-error");
const User = require("../models/User");
const redisClient = require("../redis/connect");

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

  const cachedUser = await redisClient.get(firebaseUid);

  if (cachedUser) {
    console.log("user  present in cache !");
    res.status(200).json(JSON.parse(cachedUser));
  } else {
    console.log("cache miss");
    const user = await User.findOne({ firebaseUid: firebaseUid });
    if (!user)
      throw new CustomAPIError("user does not exist", StatusCodes.NOT_FOUND);

    redisClient.set(firebaseUid, JSON.stringify(user));

    res.status(StatusCodes.OK).json(user);
  }
};

const updateUser = async (req, res) => {
  console.log("entered update user controller");
  const { firebaseUid, username } = req.body;
  if (!username) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "username needs to be provided" });
  }
  
  const updatedUser = await User.findOneAndUpdate(
    { firebaseUid: firebaseUid },
    { username: username }
  );
  redisClient.set(firebaseUid, JSON.stringify(updatedUser));
  res.status(StatusCodes.OK).json({ message: "profile updated successfully" });
};

const followUser = async (req, res) => {
  console.log("enter follow user controller");
  const { currentUserFid, followedUserFid, currentUserToken } = req.body;
  console.log(currentUserToken);
  const currentUser = await User.findOne({ firebaseUid: currentUserFid });
  const followedUser = await User.findOne({ firebaseUid: followedUserFid });
  currentUser.following.push(followedUserFid);
  followedUser.followers.push(currentUserFid);
  followedUser.followersTokens.push(currentUserToken);
  const currentUserUpdated = await User.findOneAndUpdate(
    { firebaseUid: currentUserFid },
    { following: currentUser.following }
  );
  const followedUserUpdated = await User.findOneAndUpdate(
    { firebaseUid: followedUserFid },
    {
      followers: followedUser.followers,
      followersTokens: followedUser.followersTokens,
    }
  );

  redisClient.set(currentUserFid, JSON.stringify(currentUserUpdated));
  redisClient.set(followedUserFid, JSON.stringify(followedUserUpdated));

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
