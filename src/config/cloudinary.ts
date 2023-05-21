const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storageAudio = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "podcast",
    format: "mp3",
    resource_type: "video",
    allowedFormats: ["mp3"],
  },
});

const storageImg = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "image",
    transformation: [{ width: 500, height: 500, crop: "fill" }],
    format: "jpg",
    resource_type: "image",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

const storagePodcast = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "podcast",
    resource_type: "auto",
    allowedFormats: ["jpeg", "png", "jpg", "mp3"],
    transformation: [{ width: 500, height: 500, crop: "fill" }],
  },
});

module.exports = { cloudinary, storageAudio, storageImg, storagePodcast };
