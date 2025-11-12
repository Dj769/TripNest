const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'TripNest_DEV', // Folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Note: property name must be plural -> allowed_formats
  },
});

const upload = multer({ storage }); // ✅ create multer instance

module.exports = { cloudinary, storage, upload };
