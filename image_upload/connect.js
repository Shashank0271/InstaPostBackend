const cloudinary = require('cloudinary').v2;

module.exports.setupCloudConfig = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
    });
    console.log(cloudinary.config());
}

module.exports.options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
};

module.exports.deleteImage = async (imageUrl) => {
    const urlArray = imageUrl.split('/');
    const image = urlArray[urlArray.length - 1];
    const imageName = image.split('.')[0];
    await cloudinary.uploader.destroy(imageName).then(() => {
        console.log("image deleted");
    });
}



