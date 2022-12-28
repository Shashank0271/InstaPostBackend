const { StatusCodes } = require('http-status-codes');
const Blogpost =  require('../models/Posts');

const getAllPosts = async (req, res) => {
    result = await Blogpost.find();
    res.status(StatusCodes.OK).json({ "message": "fetched all posts" , result});
};

const getMyPosts = async (req, res) => {
    //queries are passed after : ? use req.query
    //params are passed after '/' use req.params
    console.log(req.query) ;
    console.log(req.params) ;
    res.status(StatusCodes.OK).json({ "message": "fetched my posts" });
}

const createPost = async (req, res) => {
    res.status(StatusCodes.CREATED).json({ "message": "created my posts" });
}

const deletePost = async (req, res) => {
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