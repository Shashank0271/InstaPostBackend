const express = require('express');

const {
    getAllPosts,
    getMyPosts,
    createPost,
    updatePost,
    deletePost,
} = require('../controllers/post_controller');

const router = express.Router();
router.route('/').get(getAllPosts);
router.route('/:id').post(createPost).get(getMyPosts).delete(deletePost).patch(updatePost);

module.exports = router ;