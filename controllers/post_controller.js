const { request, response } = require('express');
const { StatusCodes } = require('http-status-codes');
const { CustomAPIError } = require('../errors/custom-error');
const cloudinary = require('cloudinary').v2;
const options = require('../image_upload/connect');
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
    //the checks for required properties should be placed at frontend , if image is uploaded successfully but the schema validation fails 
    //we will get a partial upload . So we must make sure that all properties are passed
    //2nd solution : make a seperate endpoint for all image crud actions (not followed here)
    console.log("entered create post controller");
    const file = req.files.photo;
    //upload post pic :
    const response = await cloudinary.uploader.upload(file.tempFilePath, options);
    const imageUrl = response.url;
    //creating post doc :
    req.body.imageUrl = imageUrl; //this depends on the image being uploaded successfully , if that fails the schema validation will eventually fail and the image nor the post will be saved
    post = await Blogpost.create(req.body);
    res.status(StatusCodes.CREATED).json({ "message": "created my posts", post });
}

//add cloudinary
const deletePost = async (req, res) => {
    console.log("entered delete posts controller")
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