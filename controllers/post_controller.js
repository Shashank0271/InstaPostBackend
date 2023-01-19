const { StatusCodes } = require('http-status-codes');
const { CustomAPIError } = require('../errors/custom-error');
const Blogpost = require('../models/Posts');

const getAllPosts = async (req, res) => {
    result = await Blogpost.find();
    res.status(StatusCodes.OK).json({ "message": "fetched all posts", result });
}

const getMyPosts = async (req, res) => {
    //queries are passed after : ? use req.query
    //params are passed after '/' use req.params
    firebaseId = req.params.id;
    posts = await Blogpost.find({ userFirebaseId: firebaseId });
    res.status(StatusCodes.OK).json({ "message": "fetched my posts", posts });
}

const createPost = async (req, res) => {
    console.log("entered");
    const post = Blogpost(req.body);
    console.log(post);
    const newPost = await post.save();
    res.status(StatusCodes.CREATED).json({ "message": "created my posts" });
}

const deletePost = async (req, res) => {
    result = await Blogpost.findByIdAndDelete(req.params.id);
    if (!result) {
        throw new CustomAPIError('Post with id does not exist', StatusCodes.NOT_FOUND);
    }
    res.status(StatusCodes.NO_CONTENT).json({ "message": "fetched my posts" });
}

const updatePost = async (req, res) => {
    res.status(StatusCodes.OK).json({ "message": "updated post" });
}

module.exports = {
    getAllPosts,
    getMyPosts,
    createPost,
    deletePost,
    updatePost,
};