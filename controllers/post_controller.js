const { StatusCodes } = require("http-status-codes");
const { CustomAPIError } = require("../errors/custom-error");
const { deleteImage } = require("../modules/cloudinaryApis/deleteFile");
const { uploadImage } = require("../modules/cloudinaryApis/createImage");
const Blogpost = require("../models/Posts");
const User = require("../models/User");
const { admin } = require("../modules/fcm/fcm");

const createPost = async (req, res) => {
  console.log("entered create post controller");
  const file = req.files.photo;
  const imageUrl = await uploadImage(file);
  console.log(imageUrl);
  req.body.imageUrl = imageUrl;
  try {
    post = await Blogpost.create(req.body);
    currentUser = await User.findOne({ firebaseUid: req.body.userFirebaseId });
    const currentPostCount = currentUser.postCount;

    //TODO : cache this update
    await User.updateOne(
      { firebaseUid: req.body.userFirebaseId },
      { postCount: currentPostCount + 1 }
    );
    if (currentUser.followersTokens.length > 0)
      await admin
        .messaging()
        .sendMulticast({
          notification: {
            title: currentUser.username,
            body: post.title,
          },
          data: {
            postId: post["_id"].toString(),
          },
          tokens: currentUser.followersTokens,
          android: {
            notification: {
              channel_id: "pushnotificationapp",
            },
          },
        })
        .then((response) => {
          console.log(response.failureCount);
          console.log(response.successCount);
          console.log("messages sent!");
        });
    res.status(StatusCodes.CREATED).json(post);
  } catch (error) {
    console.error(error.toString());
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

//TODO : update user schema and sync this api with the user profile
const likePost = async (req, res) => {
  console.log("entered like PostController");
  const { id: postId } = req.params;
  const requiredPost = await Blogpost.findById(postId);
  await Blogpost.findByIdAndUpdate(postId, { likes: requiredPost.likes + 1 });
};

//TODO : update user schema and sync this api with the user profile
const unlikePost = async (req, res) => {
  console.log("entered unlike post controller");
  const { id: postId } = req.params;
  const requiredPost = await Blogpost.findById(postId);
  await Blogpost.findByIdAndUpdate(postId, { likes: requiredPost.likes - 1 });
};

const updatePost = async (req, res) => {
  console.log("entered update post controller");
  let { title, body, category } = req.body;
  const { id: postId } = req.params;
  const file = req.files != null ? req.files.photo : null;
  console.log(file != null);
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
  if (category != undefined) {
    console.log("eNtered !");
    post.category = category;
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
    category: post.category,
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
  likePost,
  unlikePost,
};
