const cloudinary = require('cloudinary').v2;  // The Cloudinary Node SDK allows you to quickly and easily integrate your application with Cloudinary.
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // A multer storage engine for Cloudinary.

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowedFormats: ['png',"jpg","jpeg"]
    }
});

module.exports ={
    cloudinary,
    storage
}