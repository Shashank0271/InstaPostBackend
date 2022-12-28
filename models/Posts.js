const mongoose = require('mongoose') ;

const postSchema = mongoose.Schema({
    title: {
        type : String ,
        trim : true ,
        require : [true , 'a post title needs to be provided']
    },
    body : {
        type : String,
        trim : true ,
        require : [true , 'a post title needs to be provided']
    },
    category : {
        type : String,
        require : [true , 'a category needs to be provided']
    },
    likes : {
        type : Number,
        default : 0,
    },
    tags : {
        type : [String],
        default : [],
    },
    date : {
        type : Date,
        default : Date.now,
    }
});
//the name that is passed as string should be equal to the name of collection 
module.exports = mongoose.model('posts' , postSchema);