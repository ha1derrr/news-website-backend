import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { ApiError } from "./ApiError.js";
import "dotenv/config";

// 1. Configure Cloudinary with your credentials from .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Configure Multer to store the file in memory
const multerStorage = multer.memoryStorage();

// 3. Create Multer middleware for single file upload
const upload = multer({
  storage: multerStorage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new ApiError(400, "Not an image! Please upload only images."), false);
    }
  },
});

// 4. Create a middleware to upload the file to Cloudinary
const uploadToCloudinary = (req, res, next) => {
  if (!req.file) return next();

  // Upload the buffer to Cloudinary
  cloudinary.uploader
    .upload_stream(
      { folder: "news-website-avatars", resource_type: "auto" },
      (error, result) => {
        if (error) {
          return next(
            new ApiError(500, "Failed to upload avatar to Cloudinary.")
          );
        }

        req.body.avatarUrl = result.secure_url;
        next();
      }
    )
    .end(req.file.buffer);
};

export { upload, uploadToCloudinary };
