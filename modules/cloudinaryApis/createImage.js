const cloudinary = require('cloudinary').v2;
const { options } = require('./connect');

module.exports.uploadImage = async (file) => {
    const response = await cloudinary.uploader.upload(file.tempFilePath, options);
    console.log(response);
    return response.url;
}