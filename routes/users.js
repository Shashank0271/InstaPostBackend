const express = require('express');
const router = express.Router();

const {
    createUser,
    getUser,
    updateUser,
} = require('../controllers/user_controller');

router.route('/').post(createUser).patch(updateUser);
router.route('/:id').get(getUser);

module.exports = router;