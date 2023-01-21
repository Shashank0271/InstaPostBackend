const cloudinary = require('cloudinary').v2;

module.exports.deleteImage = async (imageUrl) => {
    const urlArray = imageUrl.toString().split('/');
    const image = urlArray[urlArray.length - 1];
    const imageName = image.split('.')[0];
    await cloudinary.uploader.destroy(imageName).then(() => {
        console.log("image deleted");
    });
}