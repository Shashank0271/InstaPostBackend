const express = require('express');
const router = express.Router();

const {
    createUser,
    getUser,
} = require('../controllers/user_controller');

router.route('/').post(createUser);
router.route('/:id').get(getUser);

module.exports = router;