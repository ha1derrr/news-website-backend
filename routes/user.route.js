import express from "express";
import {
  signup,
  login,
  logout,
  getMe,
  updateMe,
} from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { upload, uploadToCloudinary } from "../utils/cloudinary.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);

router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.patch(
  "/update",
  protect,
  upload.single("avatar"),
  uploadToCloudinary,
  updateMe
);

export default router;
