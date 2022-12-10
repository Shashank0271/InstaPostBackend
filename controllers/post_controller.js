const { StatusCodes } = require('http-status-codes');

const getAllPosts = async (req, res) => {
    res.status(StatusCodes.OK).json({ "message": "fetched all posts" });
};

const getMyPosts = async (req, res) => {
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