const cloudinary = require("cloudinary");
const CloudinaryStorage = require("multer-storage-cloudinary");
const multer = require("multer");
// console.log("dans cloudinary", CloudinaryStorage)

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});
const storage = CloudinaryStorage({
    cloudinary,
    folder: "algomri"
});

const fileUploader = multer({ storage});

module.exports = fileUploader;
// const cloudinary = require('cloudinary').v2;
// const { CloudinaryStorage } = require('multer-storage-cloudinary');
// const express = require('express');
// const multer = require('multer');

// const app = express();

// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: {
//     folder: 'sneaker-pictures',
//     format: async (req, file) => 'png', // supports promises as well
//     public_id: (req, file) => 'computed-filename-using-request',
//   },
// });

// const parser = multer({ storage: storage });



