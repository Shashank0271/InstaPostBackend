const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'a post title needs to be provided']
    },
    body: {
        type: String,
        trim: true,
        required: [true, 'a post title needs to be provided']
    },
    likes: {
        type: Number,
        default: 0,
    },
    category: {
        type: String,
        required: [true, 'a post category needs to be provided'],
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    userFirebaseId: {
        type: String,
        required: [true, 'user fid needs to be provided']
    },
    userName: {
        type: String,
        require: [true, 'users name must be provided']
    },
    imageUrl: {
        type: String,
    }
});
//the name that is passed as string should be equal to the name of collection 
module.exports = mongoose.model('posts', postSchema);