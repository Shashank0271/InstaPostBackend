const express = require('express');

const {
    getAllPosts,
    getMyPosts,
    createPost,
    updatePost,
    deletePost,
    getPost,
} = require('../controllers/post_controller');

const router = express.Router();
router.route('/').get(getAllPosts).post(createPost);
router.route('/:id').get(getMyPosts).delete(deletePost).patch(updatePost);
router.route('/fetchpost/:id').get(getPost);

module.exports = router;