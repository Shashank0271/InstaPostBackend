const mongoose = require('mongoose');

const User = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'a  username must be provided']
    },
    email: {
        type: String,
        required: [true, 'an email must be provided']
    },
    registrationToken: {
        type: String,
        required: [true, 'fcm registration token must be provided']
    },
    postIds: {
        type: [String],
        default: []
    },
    followersTokens: {
        type: [String],
        default: []
    },
    following: {
        type: [String],
        default: [],
    }
});

module.exports = mongoose.model('user', User);