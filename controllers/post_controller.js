const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../errors/custom-error");
const { deleteImage } = require("../modules/cloudinaryApis/deleteFile");
const { uploadImage } = require("../modules/cloudinaryApis/createImage");
const Blogpost = require("../models/Posts");
const User = require("../models/User");

const createPost = async (req, res) => {
  console.log("entered create post controller");
  const file = req.files.photo;
  const imageUrl = await uploadImage(file);
  req.body.imageUrl = imageUrl;
  // console.log(req.body);
  try {
    post = await Blogpost.create(req.body);
    currentUser = await User.findOne({ userFirebaseId: req.userFirebaseId });
    console.log(post);
    console.log(currentUser);
    const currentPostCount = currentUser.postCount;
    await User.updateOne(
      { userFirebaseId: req.userFirebaseId },
      { postCount: currentPostCount + 1 }
    );
    res.status(StatusCodes.CREATED).json(post);
  } catch (error) {
    await deleteImage(imageUrl);
    throw error;
  }
};

const getAllPosts = async (_, res) => {
  result = await Blogpost.find();
  res.status(StatusCodes.OK).json(result);
};

const getMyPosts = async (req, res) => {
  firebaseId = req.params.id;
  posts = await Blogpost.find({ userFirebaseId: firebaseId });
  res.status(StatusCodes.OK).json(posts);
};

const getPost = async (req, res) => {
  console.log("fetching single post");
  const { id: postId } = req.params;
  const post = await Blogpost.findById(postId);
  res.status(StatusCodes.OK).json(post);
};

const deletePost = async (req, res) => {
  console.log("entered delete posts controller");
  result = await Blogpost.findByIdAndDelete(req.params.id);
  if (!result) {
    throw new CustomAPIError(
      "Post with id does not exist",
      StatusCodes.NOT_FOUND
    );
  }
  await deleteImage(result.imageUrl);
  res.status(StatusCodes.NO_CONTENT).json();
};

const updatePost = async (req, res) => {
  let { title, body } = req.body;
  const { id: postId } = req.params;
  const file = req.files.photo;
  post = await Blogpost.findById(postId);
  if (!post) {
    throw new CustomAPIError(
      "Post with id does not exist",
      StatusCodes.NOT_FOUND
    );
  }
  if (title != undefined) {
    post.title = title;
  }
  if (body != undefined) {
    post.body = body;
  }
  if (file != undefined) {
    const imageUrl = post.imageUrl;
    await deleteImage(imageUrl);
    const newImageUrl = await uploadImage(file);
    post.imageUrl = newImageUrl;
  }
  await Blogpost.findByIdAndUpdate(postId, {
    title: post.title,
    body: post.body,
    imageUrl: post.imageUrl,
  });
  res.status(StatusCodes.OK).json({
    message: "updated post",
    title: post.title,
    body: post.body,
    imageUrl: post.imageUrl,
  });
};

module.exports = {
  getAllPosts,
  getMyPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
};
